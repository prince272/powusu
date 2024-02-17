"use client";

import { ElementRef, forwardRef, useRef } from "react";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { FilePond, FilePondProps, registerPlugin } from "react-filepond";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";

import { useUser } from "@/providers/user/client";
import { parseJSON } from "@/utils";
import { getErrorTitle } from "@/utils/api";
import { FilePondCallbackProps, FilePondFile, FilePondInitialFile, FilePondServerConfigProps, FilePondStyleProps } from "filepond";
import { uniqueId } from "lodash";

import { api } from "@/lib/api";

import { toast } from "./toaster";

registerPlugin(FilePondPluginImagePreview);

export interface FileInputProps extends Omit<FilePondProps, keyof FilePondCallbackProps | "server"> {
  value?: string | string[];
  onChange?: (value: string | null | string[]) => void;
  variant?: "circle" | "rectangle";
  endpoint: string;
  onUploadError?: (error: any) => void;
  onDowloadError?: (error: any) => void;
  onRevertError?: (error: any) => void;
}

const FileInput = forwardRef<ElementRef<typeof FilePond>, FileInputProps>(
  ({ value, onChange, endpoint, variant = "rectangle", onUploadError, onDowloadError, onRevertError, ...props }, ref) => {
    const currentUser = useUser();
    const filesRef = useRef<(FilePondFile & FilePondInitialFile)[]>([]);

    const loadedFiles = (Array.isArray(value) ? value : `${value ? value : ""}`.split(",").filter((source) => source)).map(
      (source) => (filesRef.current.find((file) => file.serverId == source) || { source, options: { type: "local" } }) as FilePondInitialFile
    );

    const handleChange = () => {
      const files = filesRef.current;
      const newValues = files.filter((file) => file.serverId).map((file) => file.serverId);
      const newValue = newValues.join(",").replace(/,$/, "") || null;
      onChange?.(Array.isArray(value) ? newValues : newValue);
    };

    const serverProps: FilePondServerConfigProps | { [key: string]: any } = {
      server: {
        url: api.defaults.baseURL,
        process: {
          url: endpoint.replace(/\s+$/, ""),
          method: "POST",
          withCredentials: api.defaults.withCredentials,
          headers: ((file: File, form: any) => {
            const headers: { [key: string]: string | boolean | number } = {};

            if (file) {
              headers["Upload-Name"] = file.name;
              headers["Upload-Length"] = file.size;
              headers["Upload-Offset"] = 0;
            }

            if (currentUser) headers["Authorization"] = `${currentUser.tokenType} ${currentUser.accessToken}`;
            return headers;
          }) as any,
          onerror: (responseText) => {
            const error = parseJSON(responseText);
            onUploadError?.(error);
          }
        },
        patch: {
          url: endpoint.replace(/\s+$/, "") + "?path=",
          method: "PATCH",
          withCredentials: api.defaults.withCredentials,
          headers: ({ file, offset }: { file: File; offset: number }) => {
            const headers: { [key: string]: string | boolean | number } = {};

            if (file) {
              headers["Upload-Name"] = file.name;
              headers["Upload-Length"] = file.size;
              headers["Upload-Type"] = file.type;
              headers["Upload-Offset"] = offset;
            }

            if (currentUser) headers["Authorization"] = `${currentUser.tokenType} ${currentUser.accessToken}`;
            return headers;
          },
          onerror: (responseText: any) => {
            const error = parseJSON(responseText);
            onUploadError?.(error);
          }
        },
        revert: async (uniqueFieldId: any, load: () => void, error: (errorText: string) => void) => {
          try {
            const response = await api.delete(new URL(endpoint.replace(/\s+$/, "") + "/" + uniqueFieldId, api.defaults.baseURL).toString(), {
              headers: {
                "Content-Type": "application/offset+octet-stream",
                ...(currentUser && { Authorization: `${currentUser.tokenType} ${currentUser.accessToken}` })
              },
              withCredentials: !!api.defaults.withCredentials
            });

            load();
          } catch (e) {
            // Handle any errors here
            error(getErrorTitle(e, "Unable to revert file. Please try again."));
            onRevertError?.(e);
          }
        },
        load: async (source, load, error, progress, abort, headers) => {
          try {
            // Make an Axios request to fetch the file from the server
            const response = await api.get(source, {
              responseType: "blob", // Set the responseType to 'blob' for binary data
              headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded",
              },
              onDownloadProgress: (e) => {
                // Update the progress as the file is being downloaded
                const loadedSize = e.loaded;
                const totalSize = e.total;
                progress(!!totalSize, loadedSize, totalSize || 0);
              }
            });

            // Get the file blob from the response
            const fileBlob = response.data;

            // Call the load method with the file blob
            load(fileBlob);
          } catch (e) {
            // If there's an error, call the error method with the error information
            error(getErrorTitle(e, "Unable to download file. Please try again."));
            onDowloadError?.(e);
          }

          return {
            abort: () => {
              // Cancel the Axios request if the user decides to abort
              api.cts.cancel("Request canceled by user");
              // Let FilePond know the request has been canceled
              abort();
            }
          };
        }
      },
      chunkUploads: true,
      chunkForce: true
    };

    const styleProps: FilePondStyleProps =
      variant == "circle"
        ? {
            stylePanelLayout: "compact circle",
            styleLoadIndicatorPosition: "center bottom",
            styleProgressIndicatorPosition: "right bottom",
            styleButtonRemoveItemPosition: "left bottom",
            styleButtonProcessItemPosition: "right bottom"
          }
        : {};

    return (
      <>
        <FilePond
          labelIdle={'Drag & Drop or <span class="filepond--label-action"> Browse </span>'}
          files={loadedFiles}
          onupdatefiles={(files) => {
            filesRef.current = files as any;
            handleChange();
          }}
          onreorderfiles={(files) => {
            filesRef.current = files as any;
            handleChange();
          }}
          onprocessfile={() => {
            handleChange();
          }}
          onremovefile={() => {
            handleChange();
          }}
          chunkUploads={true}
          chunkForce={true}
          credits={false}
          {...serverProps}
          {...styleProps}
          {...props}
          ref={ref}
        />
        <style jsx global>{`
          /* use a hand cursor intead of arrow for the action buttons */
          .filepond--file-action-button {
            cursor: pointer;
          }

          /* the text color of the drop label*/
          .filepond--drop-label {
            color: hsl(var(--nextui-foreground-600) / var(--nextui-foreground-600-opacity, var(--tw-text-opacity)));
            font-size: var(--nextui-font-size-small) !important;
          }

          /* underline color for "Browse" button */
          .filepond--label-action {
            text-decoration-color: hsl(var(--nextui-foreground-600) / var(--nextui-foreground-600-opacity, var(--tw-text-opacity)));
            font-size: var(--nextui-font-size-small) !important;
          }

          /* the background color of the filepond drop area */
          .filepond--panel-root {
            background-color: #eee;
          }

          /* the border radius of the drop area */
          .filepond--panel-root {
            border-radius: 0.5em;
          }

          /* the border radius of the file item */
          .filepond--item-panel {
            border-radius: 0.5em;
          }

          /* the background color of the file and file panel (used when dropping an image) */
          .filepond--item-panel {
            background-color: #555;
          }

          /* the background color of the drop circle */
          .filepond--drip-blob {
            background-color: #999;
          }

          /* the background color of the black action buttons */
          .filepond--file-action-button {
            background-color: rgba(0, 0, 0, 0.5);
          }

          /* the icon color of the black action buttons */
          .filepond--file-action-button {
            color: white;
          }

          /* the color of the focus ring */
          .filepond--file-action-button:hover,
          .filepond--file-action-button:focus {
            box-shadow: 0 0 0 0.125em rgba(255, 255, 255, 0.9);
          }

          /* the text color of the file status and info labels */
          .filepond--file {
            color: white;
          }

          /* error state color */
          [data-filepond-item-state*="error"] .filepond--item-panel,
          [data-filepond-item-state*="invalid"] .filepond--item-panel {
            background-color: hsl(var(--nextui-danger) / var(--nextui-danger-opacity, var(--tw-bg-opacity)));
          }

          [data-filepond-item-state="processing-complete"] .filepond--item-panel {
            background-color: hsl(var(--nextui-success) / var(--nextui-success-opacity, var(--tw-bg-opacity)));
          }

          /* bordered drop area */
          .filepond--panel-root {
            background-color: hsl(var(--nextui-default-100) / var(--nextui-default-100-opacity, var(--tw-bg-opacity)));
          }

          /* image preview error overlay */
          .filepond--image-preview-overlay-failure {
            color: hsl(var(--nextui-danger) / var(--nextui-danger-opacity, var(--tw-bg-opacity)));
          }

          .filepond--image-preview-overlay-success {
            color: hsl(var(--nextui-success) / var(--nextui-success-opacity, var(--tw-bg-opacity)));
          }

          .filepond--root {
            margin-bottom: 0px !important;
          }
        `}</style>
      </>
    );
  }
);
FileInput.displayName = "FileInput";

export { FileInput };
