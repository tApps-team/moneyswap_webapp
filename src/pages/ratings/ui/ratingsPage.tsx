import { RatingsHub } from "@/widgets/ratings/ratings-hub";
import { SectionScreen } from "@/widgets/ratings/section-screen";
import { useAppNavigation } from "@/shared/routing";

/** Вкладка «Рейтинги»: хаб разделов либо конкретный раздел (`?section=`). */
export const RatingsPage = () => {
  const { section, item, openSection, openItem, closeItem, closeSection } = useAppNavigation();

  if (!section) {
    return <RatingsHub onOpenSection={openSection} />;
  }

  return (
    <SectionScreen
      section={section}
      openedSlug={item}
      onOpenItem={openItem}
      onCloseItem={closeItem}
      onBack={closeSection}
    />
  );
};
