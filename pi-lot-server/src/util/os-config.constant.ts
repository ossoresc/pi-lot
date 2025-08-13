import os from 'os';

export const OS_PLATFORM = os.platform();
export const IS_WINDOWS = OS_PLATFORM === 'win32';
export const IS_LINUX = OS_PLATFORM === 'linux';
