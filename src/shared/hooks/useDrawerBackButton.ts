import { useCallback, useEffect } from "react";
import {
	hideBackButton,
	isBackButtonAvailable,
	removeBackButtonHandler,
	setBackButtonHandler,
	showBackButton,
	handleVibration
} from "@/shared/lib";

interface IUseDrawerBackButtonOptions {
	isOpen: boolean;
	onClose: () => void;
}

/**
 * Хук для управления кнопкой "Back" в Telegram WebApp для drawer'ов
 */
export const useDrawerBackButton = (options: IUseDrawerBackButtonOptions) => {
	const { isOpen, onClose } = options;

	const handleBack = useCallback(() => {
		onClose();
		handleVibration();
	}, [onClose]);

	useEffect(() => {
		if (!isBackButtonAvailable()) {
			console.log('Back button not available');
			return;
		}

		console.log('useDrawerBackButton effect:', { isOpen });

		if (isOpen) {
			console.log('Showing back button');
			showBackButton();
			setBackButtonHandler(handleBack);
		} else {
			console.log('Hiding back button');
			hideBackButton();
			removeBackButtonHandler(handleBack);
		}

		// Cleanup при размонтировании компонента
		return () => {
			if (isBackButtonAvailable()) {
				console.log('Cleanup: removing back button handler');
				removeBackButtonHandler(handleBack);
			}
		};
	}, [isOpen, handleBack]);

	return {
		isAvailable: isBackButtonAvailable()
	};
};
