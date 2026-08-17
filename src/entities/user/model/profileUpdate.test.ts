import { describe, expect, it } from 'vitest';
import { createProfileUpdateBody, createUserUpdateBody, stripImageDataUrl } from './profileUpdate';
import type { Profile, User } from './types';

const user: User = {
  id: 'user-1',
  username: 'old-name',
  email: 'user@example.com',
  city: 'Old city',
  avatarUrl: 'https://cdn.example.com/avatar.png',
  country: 'Russia',
  birthday: '2000-01-01',
  address: 'Old address',
};

const profile: Profile = {
  id: 'profile-1',
  profileType: 1,
  specializationId: 2,
  description: 'Old description',
  markingWeight: 1,
  profileSkills: [{ id: 10, title: 'React' }],
};

describe('profile update payloads', () => {
  it('converts an image data URL to the base64 value expected by the API', () => {
    expect(stripImageDataUrl('data:image/png;base64,aGVsbG8=')).toBe('aGVsbG8=');
  });

  it('sends the complete UpdateUserDto when the username changes', () => {
    expect(createUserUpdateBody(user, { username: ' new-name ', city: ' Moscow ' })).toEqual({
      username: 'new-name',
      country: 'Russia',
      city: 'Moscow',
      birthday: '2000-01-01',
      address: 'Old address',
      avatarUrl: 'https://cdn.example.com/avatar.png',
    });
    expect(createUserUpdateBody(user, { username: 'old-name', city: 'Old city' })).toEqual({});
  });

  it('combines changed user fields and the avatar into one request', () => {
    expect(
      createUserUpdateBody(user, {
        username: 'old-name',
        city: ' New city ',
        avatarImage: 'base64-image',
      }),
    ).toEqual({
      city: 'New city',
      avatarImage: 'base64-image',
    });
  });

  it('sends a changed specialization when updating an existing profile', () => {
    const body = createProfileUpdateBody(profile, {
      specializationId: 3,
      description: ' New description ',
      skillIds: [10, 11],
    });

    expect(body).toMatchObject({
      specializationId: 3,
      description: 'New description',
      profileSkills: ['10', '11'],
    });
    expect(body).not.toHaveProperty('id');
  });

  it('does not repeat an unchanged specialization', () => {
    expect(
      createProfileUpdateBody(profile, {
        specializationId: profile.specializationId,
        description: '',
        skillIds: [],
      }),
    ).not.toHaveProperty('specializationId');
  });

  it('sets a specialization when an empty profile is completed for the first time', () => {
    expect(
      createProfileUpdateBody(
        { ...profile, specializationId: 0 },
        { specializationId: 3, description: '', skillIds: [] },
      ),
    ).toHaveProperty('specializationId', 3);
  });
});
