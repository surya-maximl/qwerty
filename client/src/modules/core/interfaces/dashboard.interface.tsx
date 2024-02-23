export type appType = {
  appId: string;
  versions: { [id: string]: { version: string; boxes: any } };
  title: string;
  userId: string;
};

export type itemType = {
  key: string,
  label: JSX.Element
}