"use server";

import { getStartOfDay } from "@elvora/pages/careers/utils";
import { JobPostingMini } from "@elvora/types/careers";
import { JobForm } from "@elvora/types/payload";
import { getPayload } from "@elvora/utils/payload";
import type { Where } from "payload";

const defaultAndFilter: Where[] = [
  {
    status: {
      equals: "published",
    },
    and: [
      {
        or: [
          {
            job_expiration: {
              greater_than_equal: getStartOfDay(),
            },
          },
          {
            job_expiration: {
              equals: null,
            },
          },
        ],
      },
    ],
  },
];

const getJobsList = async () => {
  const payload = await getPayload();

  const data = await payload.find({
    collection: "job-postings",
    depth: 1,
    where: {
      and: defaultAndFilter,
    },
  });

  return {
    docs: data.docs.map((job) => {
      const item: JobPostingMini = {
        uuid: job.uuid,
        role: job.role,
        metadata: job.metadata as JobPostingMini["metadata"],
        createdAt: job.createdAt,
        details: job.details,
        job_expiration: job.job_expiration,
      };

      return item;
    }),
  };
};

const getJobByUuid = async (uuid: string, only_active = false) => {
  const payload = await getPayload();

  const data = await payload.find({
    collection: "job-postings",
    depth: 2,
    limit: 1,
    where: {
      and: [
        {
          uuid: {
            equals: uuid,
          },
        },
        {
          status: {
            equals: "published",
          },
        },
        ...(only_active ? defaultAndFilter : []),
      ],
    },
  });

  return data.docs[0];
};

const getRolesAndLocations = async () => {
  const payload = await getPayload();

  const roles = getJobsList().then((response) => {
    return response.docs.reduce(
      (prev, job) => {
        prev[job.role] = true;
        return prev;
      },
      {} as Record<string, boolean>
    );
  });

  const locations = payload
    .find({
      collection: "job-locations",
      depth: 2,
    })
    .then((response) => {
      return response.docs.reduce(
        (prev, location) => {
          prev[location.location] = true;
          return prev;
        },
        {} as Record<string, boolean>
      );
    });

  return Promise.all([roles, locations]);
};

const getJobFormByJobUUID = async (job_uuid: string) => {
  const payload = await getPayload();

  const job = await payload.find({
    collection: "job-postings",
    where: {
      uuid: {
        equals: job_uuid,
      },
    },
    depth: 1,
  });

  const _job = job.docs[0];

  if (!_job) {
    return null;
  }
  return {
    id: _job.id,
    role: _job.role,
    job_questions: _job.job_questions as JobForm,
    metadata: _job.metadata,
    uuid: _job.uuid,
    job_expiration: _job.job_expiration,
  };
};

const getJobApplicationById = async (id: string, job_uuid: string) => {
  const payload = await getPayload();

  const application = await payload.find({
    collection: "job-applications",
    where: {
      and: [
        {
          id: {
            equals: id,
          },
        },
        {
          "job.uuid": {
            equals: job_uuid,
          },
        },
      ],
    },
  });

  return application.docs[0];
};

export {
  getJobApplicationById,
  getJobByUuid,
  getJobFormByJobUUID,
  getJobsList,
  getRolesAndLocations,
};
