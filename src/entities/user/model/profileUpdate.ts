import type { Profile, User } from './types';

export interface UserUpdateBody {
  username?: string;
  country?: string;
  city?: string;
  birthday?: string | null;
  address?: string;
  avatarUrl?: string;
  avatarImage?: string;
}

export interface ProfileUpdateBody extends Partial<Omit<Profile, 'id' | 'profileSkills'>> {
  specializationId?: number;
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
): UserUpdateBody => {
  const body: UserUpdateBody = {};
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
  profile: Profile,
  values: {
    specializationId: number;
    description: string;
    skillIds: number[];
  },
): ProfileUpdateBody => {
  return {
    description: values.description.trim(),
    profileSkills: values.skillIds.map(String),
    ...(values.specializationId > 0 && profile.specializationId !== values.specializationId
      ? { specializationId: values.specializationId }
      : {}),
  };
};
