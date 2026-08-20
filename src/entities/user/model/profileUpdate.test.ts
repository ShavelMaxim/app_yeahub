import { describe, expect, it } from 'vitest';
import { createProfileUpdateBody, createUserUpdateBody, stripImageDataUrl } from './profileUpdate';
import type { User } from './types';

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

  it('creates the exact UpdateProfileDto body', () => {
    const body = createProfileUpdateBody({
      description: ' New description ',
      skillIds: [10, 11],
    });

    expect(body).toEqual({
      description: 'New description',
      profileSkills: ['10', '11'],
    });
    expect(body).not.toHaveProperty('specializationId');
  });
});
