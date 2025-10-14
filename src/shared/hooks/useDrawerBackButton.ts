import { useCallback, useEffect, useRef } from "react";
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
	priority?: number; // Приоритет: чем больше число, тем выше приоритет
}

// Глобальная очередь обработчиков с приоритетами
let backButtonHandlers: Array<{
	handler: () => void;
	priority: number;
	ref: React.MutableRefObject<boolean>;
}> = [];

const executeTopHandler = () => {
	// Находим активный обработчик с наивысшим приоритетом
	const activeHandler = backButtonHandlers
		.filter(item => item.ref.current)
		.sort((a, b) => b.priority - a.priority)[0];
	
	if (activeHandler) {
		activeHandler.handler();
	}
};

/**
 * Хук для управления кнопкой "Back" в Telegram WebApp для drawer'ов
 * Поддерживает иерархию drawer'ов через приоритеты
 */
export const useDrawerBackButton = (options: IUseDrawerBackButtonOptions) => {
	const { isOpen, onClose, priority = 0 } = options;
	const isActiveRef = useRef(false);

	const handleBack = useCallback(() => {
		onClose();
		handleVibration();
	}, [onClose]);

	useEffect(() => {
		if (!isBackButtonAvailable()) {
			console.log('Back button not available');
			return;
		}

		console.log('useDrawerBackButton effect:', { isOpen, priority });

		if (isOpen) {
			console.log('Showing back button with priority:', priority);
			isActiveRef.current = true;
			
			// Добавляем обработчик в очередь
			const handlerItem = {
				handler: handleBack,
				priority,
				ref: isActiveRef
			};
			
			backButtonHandlers.push(handlerItem);
			
			// Показываем кнопку и устанавливаем глобальный обработчик
			showBackButton();
			setBackButtonHandler(executeTopHandler);
		} else {
			console.log('Hiding back button');
			isActiveRef.current = false;
			
			// Удаляем обработчик из очереди
			backButtonHandlers = backButtonHandlers.filter(item => item.ref !== isActiveRef);
			
			// Если нет активных обработчиков, скрываем кнопку
			if (backButtonHandlers.length === 0) {
				hideBackButton();
				removeBackButtonHandler(executeTopHandler);
			}
		}

		// Cleanup при размонтировании компонента
		return () => {
			if (isBackButtonAvailable()) {
				console.log('Cleanup: removing back button handler');
				isActiveRef.current = false;
				backButtonHandlers = backButtonHandlers.filter(item => item.ref !== isActiveRef);
				
				if (backButtonHandlers.length === 0) {
					hideBackButton();
					removeBackButtonHandler(executeTopHandler);
				}
			}
		};
	}, [isOpen, handleBack, priority]);

	return {
		isAvailable: isBackButtonAvailable()
	};
};
