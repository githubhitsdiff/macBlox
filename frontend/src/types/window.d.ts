export type {};

declare global {
	interface Window {
		/** Mode of the application: "window", "browser", "cloud", or "chrome" */
		NL_MODE: string;

		/** Application port (typically a number indicating the communication port) */
		NL_PORT: number;

		/** Command-line arguments passed to the application */
		NL_ARGS: string[];

		/** Basic authentication token for the application */
		NL_TOKEN: string;

		/** Version of the Neutralinojs client */
		NL_CVERSION: string;

		/** Unique identifier for the application */
		NL_APPID: string;

		/** Version of the application */
		NL_APPVERSION: string;

		/** Path to the application's directory */
		NL_PATH: string;

		/** Returns true if extensions are enabled in the application */
		NL_EXTENABLED: boolean;

		/** Operating system name (e.g., "Linux", "Windows", "Darwin" for macOS) */
		NL_OS: string;

		/** Version of the Neutralinojs server */
		NL_VERSION: string;

		/** Current working directory of the application */
		NL_CWD: string;

		/** Identifier of the current process (process ID) */
		NL_PID: string;

		/** Defines the source of the application's resources: "bundle" or "directory" */
		NL_RESMODE: string;

		/** Release commit identifier for the Neutralinojs client library */
		NL_CCOMMIT: string;

		/** An array of custom methods provided by the application */
		NL_CMETHODS: string[];

		/** Custom data passed in the URL scheme (used to pass data from external sources) */
		DATA: string;
	}
}
