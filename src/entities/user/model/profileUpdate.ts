import type { User } from './types';

/** Request body from the OpenAPI UpdateUserDto schema. */
export interface UpdateUserRequest {
  username?: string;
  country?: string;
  city?: string;
  birthday?: string | null;
  address?: string;
  avatarUrl?: string;
  avatarImage?: string;
}

/** Request body from the OpenAPI UpdateProfileDto schema. */
export interface UpdateProfileRequest {
  description: string;
  profileSkills: string[];
}

export const stripImageDataUrl = (dataUrl: string): string => {
  const separatorIndex = dataUrl.indexOf(',');
  return separatorIndex >= 0 ? dataUrl.slice(separatorIndex + 1) : dataUrl;
};

export const createUserUpdateBody = (
  user: User,
  values: { username: string; city: string; avatarImage?: string | null },
): UpdateUserRequest => {
  const body: UpdateUserRequest = {};
  const username = values.username.trim();
  const city = values.city.trim();

  if (username !== user.username) {
    return {
      username,
      country: user.country ?? '',
      city,
      birthday: user.birthday ?? null,
      address: user.address ?? '',
      avatarUrl: user.avatarUrl ?? '',
      ...(values.avatarImage ? { avatarImage: values.avatarImage } : {}),
    };
  }

  if (city !== (user.city ?? '')) body.city = city;
  if (values.avatarImage) body.avatarImage = values.avatarImage;

  return body;
};

export const createProfileUpdateBody = (
  values: {
    description: string;
    skillIds: number[];
  },
): UpdateProfileRequest => {
  return {
    description: values.description.trim(),
    profileSkills: values.skillIds.map(String),
  };
};
