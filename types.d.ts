declare global {
	interface DocumentPictureInPicture {
		requestWindow(): Promise<PipWindow>
		// add other methods/events if needed
	}

	interface PipWindow extends Window {
		// whatever properties/methods the PiP window has
	}

	// then extend the Window
	interface Window {
		documentPictureInPicture: DocumentPictureInPicture
	}
}

export {}
