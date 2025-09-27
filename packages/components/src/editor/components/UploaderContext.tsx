import { createContext, useContext, type PropsWithChildren } from "react";

type UploaderContextType = {
  onImageUpload: (file: File) => Promise<string>;
};

// Create context with default value
const UploaderContext = createContext<UploaderContextType>({
  onImageUpload: async () => {
    throw new Error("Image upload not implemented");
  },
});

// Props type for the provider
export type UploaderProviderProps = PropsWithChildren<UploaderContextType>;

export const UploaderProvider = ({ children, onImageUpload }: UploaderProviderProps) => {
  return <UploaderContext.Provider value={{ onImageUpload }}>{children}</UploaderContext.Provider>;
};

// Custom hook to use the context
export const useUploader = () => {
  return useContext(UploaderContext);
};
