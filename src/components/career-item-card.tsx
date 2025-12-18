import { JobPostingMini } from "@elvora/types/careers";
import { fDate } from "@elvora/utils/formatDate";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const CareerItemCard: React.FC<CareerItemCardProps> = ({ item }) => {
  const hasPayRange = item.metadata?.min_pay || item.metadata?.max_pay;

  return (
    <Card sx={sx}>
      <CardHeader
        title={item.role}
        subheader={
          item.job_expiration
            ? `Apply by ${fDate(item.job_expiration)}`
            : item.createdAt
              ? `Posted on ${fDate(item.createdAt)}`
              : undefined
        }
        slotProps={{
          title: {
            variant: "subtitle1",
            color: "secondary.main",
          },
          subheader: {
            variant: "caption",
          },
        }}
        action={
          !!hasPayRange && (
            <Typography
              variant="caption"
              component="p"
              maxWidth={120}
              color="secondary.main"
            >
              £{item.metadata?.min_pay}{" "}
              {!!item.metadata?.max_pay && `to ${item.metadata?.max_pay}`} per
              hour
            </Typography>
          )
        }
      />
      <CardContent>
        <Stack direction="row" spacing={0.5} mb={1} alignItems="center">
          <LocationOnOutlined className="location-icon" />

          <Typography
            variant="body2"
            color="secondary.main"
            component="p"
            letterSpacing={0.8}
            lineHeight={1}
          >
            {item.metadata?.job_location?.location || "Remote"}
          </Typography>
        </Stack>

        <Typography variant="body2" color="textSecondary" component="p">
          {item.details?.short_description}
        </Typography>

        <Divider flexItem />
        <Typography
          variant="caption"
          color="primary.main"
          component="p"
          className="view-job-description"
        >
          View Job Description
        </Typography>
      </CardContent>
    </Card>
  );
};

export type CareerItemCardProps = {
  item: JobPostingMini;
};

const sx: SxProps = {
  width: "100%",
  height: "100%",
  borderRadius: 0.5,
  boxShadow: 12,
  "& .MuiCardHeader-root": {
    paddingBottom: 0,
  },
  "& .MuiCardHeader-action": {
    alignSelf: "center",
  },
  "& .MuiCardContent-root": {
    paddingTop: 1,
    "& .location-icon": {
      color: "secondary.main",
      marginLeft: -0.5,
      transform: "translateY(-0.08rem)",
      fontSize: 20,
    },
    "& .expiration-icon": {
      color: "text.secondary",
      marginLeft: -0.5,
      transform: "translateY(-0.08rem)",
      fontSize: 20,
    },

    "& .view-job-description": {
      cursor: "pointer",
      fontWeight: 500,
    },

    "& .MuiDivider-root": {
      borderColor: "primary.main",
      marginTop: 2,
      marginBottom: 1.5,
    },
  },
};

export { CareerItemCard };
