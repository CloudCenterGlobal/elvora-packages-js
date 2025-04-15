import { ProfileImage, User } from "@elvora/types/payload";
import { toMediaUrl } from "@elvora/utils/functions";
import { getOptimizedImage } from "@elvora/utils/image";
import MuiAvatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

const PayloadAvatar: React.FC<PayloadAvatarProps> = ({ user }) => {
  const profileImage = user?.avatar as ProfileImage | undefined;

  return (
    <Tooltip title={user.name} placement="top">
      <MuiAvatar
        src={
          !!profileImage
            ? getOptimizedImage(
                {
                  src: toMediaUrl(profileImage.url)!,
                  height: profileImage.height || 100,
                  width: profileImage.width || 100,
                },
                50
              )
            : undefined
        }
      />
    </Tooltip>
  );
};

export type PayloadAvatarProps = {
  user: User;
};

export { PayloadAvatar };
