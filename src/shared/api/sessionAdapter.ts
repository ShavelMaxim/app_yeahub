export interface ApiSessionAdapter {
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
  clearSession: () => void;
}

const emptySessionAdapter: ApiSessionAdapter = {
  getAccessToken: () => null,
  setAccessToken: () => undefined,
  clearSession: () => undefined,
};

let sessionAdapter = emptySessionAdapter;

export const configureApiSession = (adapter: ApiSessionAdapter) => {
  sessionAdapter = adapter;
};

export const getApiSession = (): ApiSessionAdapter => sessionAdapter;
