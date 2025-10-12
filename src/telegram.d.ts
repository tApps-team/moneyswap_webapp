declare global {
	interface Window {
		Telegram: {
			WebApp: {
				// sendData: (data: string) => void;
				enableClosingConfirmation: () => void;
				expand: () => void;
				ready: () => void;
				requestFullscreen?: () => void;
				exitFullscreen?: () => void;
				WebAppUser: {
					id: number;
				};
				platform: string;
				initData: string;
				initDataUnsafe: {
					user: {
						id: number;
						is_bot: boolean;
						first_name: string;
						last_name: string;
						username: string;
						language_code: string;
						is_premium: boolean;
						added_to_attachment_menu: boolean;
						allows_write_to_pm: boolean;
						photo_url: string;
					};
				};
				openLink: (
					url: string,
					options?: { try_instant_view: boolean }[]
				) => void;
				close: () => void;
				isExpanded?: boolean;
				openTelegramLink: (url: string) => void;
				HapticFeedback: {
					impactOccurred: (
						style: "light" | "medium" | "heavy" | "soft" | "hard"
					) => void;
				};
				BackButton: {
					show: () => void;
					hide: () => void;
					onClick: (callback: () => void) => void;
					offClick: (callback: () => void) => void;
					isVisible: boolean;
				};
			};
		};
	}
}

export {};
