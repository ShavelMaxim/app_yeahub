import { describe, expect, it, vi } from 'vitest';
import { baseApi } from '@/shared/api';
import { clearCredentials } from './authSlice';
import { endSession } from './endSession';

describe('endSession', () => {
  it('clears credentials and the RTK Query cache together', () => {
    const dispatch = vi.fn();

    endSession()(dispatch, () => ({}), undefined);

    expect(dispatch).toHaveBeenNthCalledWith(1, clearCredentials());
    expect(dispatch).toHaveBeenNthCalledWith(2, baseApi.util.resetApiState());
  });
});
