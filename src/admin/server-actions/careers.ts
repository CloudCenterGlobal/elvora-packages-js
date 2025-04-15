"use server";
import { fData } from "@elvora/utils/formatNumber";
import { File } from "buffer";
import fs, { readFileSync } from "fs";
import mime from "mime-types";
import { loadAndCompileTemplate } from "@elvora/mjml/helpers";
import { redirect, RedirectType } from "next/navigation";
import path from "path";
import { sendFormSubmissionMail } from "@elvora/utils/mailer";
import { CareersApplicationFormValues, MAX_SIZE } from "@elvora/components/forms/carrers/application";
import { getFormSubmissionValuesAsArray, getOriginAndreferer } from "@elvora/utils/functions";
import { getPayload } from "@elvora/utils/payload";
import { getJobByUuid } from "./jobs";
import { baseRoutes } from "@elvora/routes";
import { JobApplication, JobPosting } from "@elvora/types";
import { RECRUITMENT_EMAIL } from "@elvora/constants/email";
import { BASE_DIR } from "@elvora/constants/common";

const file_types = {
  "application/pdf": true,
  "application/msword": true,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
  "application/vnd.oasis.opendocument.text": true,
} as const;

const onCareerApplicationSubmit = async (data: CareersApplicationFormValues) => {
  if (data.cv) {
    if (!data.cv.type || !file_types[data.cv.type as keyof typeof file_types]) {
      return {
        error: "Invalid file type",
      };
    }

    if (data.cv.size > MAX_SIZE) {
      return {
        error: `File size too large. Max size is ${fData(MAX_SIZE)}`,
      };
    }
  }
  const job = await getJobByUuid(data.uuid);

  if (!job) {
    return {
      error: "Invalid job posting",
    };
  }

  const application = await getOrCreateJobApplication(job, data);

  if (!job.job_questions) {
    await sendJobApplicationMail(job, data, application);
  } else {
    redirect(baseRoutes.careers.assessment(job.uuid!, application.id), RedirectType.push);
  }

  return {
    success: true,
  };
};

const sendJobApplicationMail = async (job: JobPosting, data: CareersApplicationFormValues, application?: JobApplication) => {
  // if cv is a buffer, use it as is
  const buffer = data.cv instanceof Buffer ? data.cv : Buffer.from(await data.cv.arrayBuffer());

  const { referer, origin } = await getOriginAndreferer();

  const title = `New Job Application for ${job.role} - ${data.first_name} ${data.last_name}`;

  const url = origin + (application ? baseRoutes.admin.collections.jobApplications.detailById(application.id) : baseRoutes.careers.detail(job.uuid!));

  sendFormSubmissionMail({
    to: RECRUITMENT_EMAIL,
    html: loadAndCompileTemplate("forms-submission", {
      description: "A new job application has been submitted",
      title,
      form: {
        items: getFormSubmissionValuesAsArray(data, {
          cv: true,
          uuid: true,
        }),
        referer,
      },
      banner: {
        title: "View Application",
        image: origin + "/images/logo.png",
        link: {
          url,
          text: job.role,
        },
      },
    }),
    subject: title,
    attachments: [
      {
        filename: data.cv.name,
        content: buffer,
        contentType: data.cv.type,
      },
    ],
  });
};

/**
 * use this function ONLY when you want to create or update a job application. CV file will be created or updated
 * @returns
 */
const getOrCreateJobApplication = async (job: JobPosting, data: CareersApplicationFormValues) => {
  const payload = await getPayload();

  const application = await payload.find({
    collection: "job-applications",
    where: {
      job: {
        equals: job.id,
      },
      email: {
        equals: data.email,
      },
    },
  });

  if (application.docs.length > 0) {
    // update the existing application
    await deleteCVFile(application.docs[0].cv);

    return await payload.update({
      collection: "job-applications",
      id: application.docs[0].id,
      data: {
        job: job.id,
        first_name: data.first_name,
        last_name: data.last_name,
        mobile: data.mobile,
        cv: getCvFilename(job.uuid!, data.cv),
      },
    });
  }

  const cv_path = getCvFilename(job.uuid!, data.cv, true);

  return await payload
    .create({
      collection: "job-applications",
      data: {
        job: job.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        mobile: data.mobile,
        cv: cv_path,

        assessment: {
          answers: {},
          fields: [],
        },
      },
    })
    .then(async (application) => {
      await createCVFile(cv_path, data.cv);
      return application;
    });
};

const getCvFilename = (job_uuid: string, cv: File | globalThis.File, absolute?: boolean) => {
  const prefix = `public/media/job-applications/${job_uuid}`;

  const filename = `${prefix}/${cv.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;

  if (absolute) {
    return filename;
  }

  return filename;
};

const loadCvFromAbsolutePath = (cv_path: string) => {
  const realPath = path.join(BASE_DIR, cv_path);
  return new File([readFileSync(realPath)], cv_path.split("/").pop()!, {
    type: mime.lookup(realPath) || "application/pdf",
  });
};

const createCVFile = async (cv_path: string, cv: File | globalThis.File) => {
  const dir = path.dirname(cv_path);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // write the CV to the file
  const attachmentBuffer = await cv.arrayBuffer();
  const buffer = Buffer.from(attachmentBuffer!);

  fs.writeFile(cv_path, buffer, (err: any) => {
    if (err) {
      console.error("Error writing file:", err);
    }
    console.log("File written successfully");
  });

  return cv_path;
};

const deleteCVFile = async (cv_path: string) => {
  const realPath = path.join(BASE_DIR, cv_path);
  if (fs.existsSync(realPath)) {
    fs.unlink(realPath, (err: any) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
      console.log("File deleted successfully");
    });
  }
};

const onCompleteAssessmentSubmit = async ({
  application_id,
  job_uuid,
  answers,
  fields,
}: {
  application_id: string;
  job_uuid: string;
  answers: { [key: string]: any };
  fields: any[];
}) => {
  // get the job application
  const payload = await getPayload();
  const response = await payload.update({
    collection: "job-applications",
    where: {
      id: {
        equals: application_id,
      },
      "job.uuid": {
        equals: job_uuid,
      },
    },
    data: {
      assessment: {
        answers,
        fields,
      },
    },
  });

  if (response.docs?.length === 0) {
    return {
      success: false,
      error: "Job application not found",
    };
  }

  let cv: File | Buffer = Buffer.from("");

  if (response.docs[0].cv) {
    cv = loadCvFromAbsolutePath(response.docs[0].cv);
  }

  sendJobApplicationMail(
    response.docs[0].job as JobPosting,
    {
      first_name: response.docs[0].first_name,
      last_name: response.docs[0].last_name,
      email: response.docs[0].email,
      mobile: response.docs[0].mobile!,
      cv: cv as unknown as globalThis.File,
      // @ts-ignore
      uuid: response.docs[0].job.uuid!,
    },
    response.docs[0]
  );

  return {
    success: true,
    message: "Assessment submitted successfully",
    data: response.docs[0],
  };
};

export { deleteCVFile, onCareerApplicationSubmit, onCompleteAssessmentSubmit };
