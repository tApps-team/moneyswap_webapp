export const handleVibration = () => {
	if (window.Telegram?.WebApp?.HapticFeedback) {
		window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
	}
};
