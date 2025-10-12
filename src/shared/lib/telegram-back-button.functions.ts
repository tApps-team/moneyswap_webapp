/**
 * Показывает кнопку "Back"
 */
export const showBackButton = () => {
	const tg = window?.Telegram?.WebApp;
	if (tg?.BackButton) {
		tg.BackButton.show();
	}
};

/**
 * Скрывает кнопку "Back"
 */
export const hideBackButton = () => {
	const tg = window?.Telegram?.WebApp;
	if (tg?.BackButton) {
		tg.BackButton.hide();
	}
};

/**
 * Устанавливает обработчик нажатия на кнопку "Back"
 */
export const setBackButtonHandler = (callback: () => void) => {
	const tg = window?.Telegram?.WebApp;
	if (tg?.BackButton) {
		tg.BackButton.onClick(callback);
	}
};

/**
 * Удаляет обработчик нажатия на кнопку "Back"
 */
export const removeBackButtonHandler = (callback: () => void) => {
	const tg = window?.Telegram?.WebApp;
	if (tg?.BackButton) {
		tg.BackButton.offClick(callback);
	}
};

/**
 * Проверяет, видна ли кнопка "Back"
 */
export const isBackButtonVisible = (): boolean => {
	const tg = window?.Telegram?.WebApp;
	return tg?.BackButton?.isVisible || false;
};

/**
 * Проверяет, доступна ли кнопка "Back"
 */
export const isBackButtonAvailable = (): boolean => {
	return !!window?.Telegram?.WebApp?.BackButton;
};
