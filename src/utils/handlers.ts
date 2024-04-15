import axios from 'axios';
import toast from 'react-hot-toast';

export const errorHandler = <T extends any[], R>(
  func: (...args: T) => Promise<R>
): ((...args: T) => Promise<R | undefined>) => {
  return async (...args: T) => {
    try {
      return await func(...args); // Execute the passed function with arguments
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        if (error.response?.data?.errors && error.response?.data?.errors[0].message) {
          toast.error(error.response?.data?.errors[0].message);
        } else if (error.response?.data?.message) {
          toast.error(error.response?.data?.message);
        }
      } else {
        console.log('error', error);
        toast.error((error as Error).message);
      }
      return undefined;
    }
  };
};
