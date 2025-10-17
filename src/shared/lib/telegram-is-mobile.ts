export const isTelegramMobile = (): boolean => {
  const tg = window?.Telegram?.WebApp;
  if (!tg) return false;
  
  const platform = tg.platform;
  const mobilePlatforms = ["android", "ios"];
  
  return mobilePlatforms.includes(platform);
};
