import { examples as accordionExamples, manifest as accordionManifest } from "./accordion.manifest";
import { examples as boxExamples, manifest as boxManifest } from "./box.manifest";
import { examples as buttonExamples, manifest as buttonManifest } from "./button.manifest";
import { examples as cardExamples, manifest as cardManifest } from "./card.manifest";
import { examples as carouselExamples, manifest as carouselManifest } from "./carousel.manifest";
import { examples as footerExamples, manifest as footerManifest } from "./footer.manifest";
import { examples as formExamples, manifest as formManifest } from "./form.manifest";
import { examples as heroExamples, manifest as heroManifest } from "./hero.manifest";
import { examples as iconExamples, manifest as iconManifest } from "./icon.manifest";
import { examples as imageExamples, manifest as imageManifest } from "./image.manifest";
import { examples as imagesWallExamples, manifest as imagesWallManifest } from "./images-gallery.manifest";
import { examples as mapExamples, manifest as mapManifest } from "./map.manifest";
import { examples as navbarExamples, manifest as navbarManifest } from "./navbar.manifest";
import { examples as sidebarExamples, manifest as sidebarManifest } from "./sidebar.manifest";
import { examples as socialLinksExamples, manifest as socialLinksManifest } from "./social-links.manifest";
import { examples as spacerExamples, manifest as spacerManifest } from "./spacer.manifest";
import { examples as testimonialsExamples, manifest as testimonialsManifest } from "./testimonials.manifest";
import { examples as textExamples, manifest as textManifest } from "./text.manifest";
import { examples as videoExamples, manifest as videoManifest } from "./video.manifest";
import { examples as htmlExamples, manifest as htmlManifest } from "./html.manifest";
import { examples as tableExamples, manifest as tableManifest } from "./table.manifest";
import { examples as tabsExamples, manifest as tabsManifest } from "./tabs.manifest";
import { examples as timelineExamples, manifest as timelineManifest } from "./timeline.manifest";
import { getBrickManifestDefaults, type BrickDefaults, type BrickManifest } from "../../brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
import type { Static } from "@sinclair/typebox";

export const manifests: Record<string, BrickManifest> = {
  [textManifest.type]: textManifest,
  [heroManifest.type]: heroManifest,
  [imageManifest.type]: imageManifest,
  [videoManifest.type]: videoManifest,
  [cardManifest.type]: cardManifest,
  [mapManifest.type]: mapManifest,
  [formManifest.type]: formManifest,
  [sidebarManifest.type]: sidebarManifest,
  [imagesWallManifest.type]: imagesWallManifest,
  [carouselManifest.type]: carouselManifest,
  [navbarManifest.type]: navbarManifest,
  [footerManifest.type]: footerManifest,
  [buttonManifest.type]: buttonManifest,
  [iconManifest.type]: iconManifest,
  [socialLinksManifest.type]: socialLinksManifest,
  [boxManifest.type]: boxManifest,
  [spacerManifest.type]: spacerManifest,
  [testimonialsManifest.type]: testimonialsManifest,
  [accordionManifest.type]: accordionManifest,
  [htmlManifest.type]: htmlManifest,
  [tableManifest.type]: tableManifest,
  [tabsManifest.type]: tabsManifest,
  [timelineManifest.type]: timelineManifest,
};

export const defaultProps: Record<keyof typeof manifests, BrickDefaults> = {
  [textManifest.type]: getBrickManifestDefaults(textManifest),
  [heroManifest.type]: getBrickManifestDefaults(heroManifest),
  [imageManifest.type]: getBrickManifestDefaults(imageManifest),
  [videoManifest.type]: getBrickManifestDefaults(videoManifest),
  [cardManifest.type]: getBrickManifestDefaults(cardManifest),
  [sidebarManifest.type]: getBrickManifestDefaults(sidebarManifest),
  [mapManifest.type]: getBrickManifestDefaults(mapManifest),
  [formManifest.type]: getBrickManifestDefaults(formManifest),
  [imagesWallManifest.type]: getBrickManifestDefaults(imagesWallManifest),
  [carouselManifest.type]: getBrickManifestDefaults(carouselManifest),
  [navbarManifest.type]: getBrickManifestDefaults(navbarManifest),
  [footerManifest.type]: getBrickManifestDefaults(footerManifest),
  [buttonManifest.type]: getBrickManifestDefaults(buttonManifest),
  [iconManifest.type]: getBrickManifestDefaults(iconManifest),
  [socialLinksManifest.type]: getBrickManifestDefaults(socialLinksManifest),
  [boxManifest.type]: getBrickManifestDefaults(boxManifest),
  [spacerManifest.type]: getBrickManifestDefaults(spacerManifest),
  [testimonialsManifest.type]: getBrickManifestDefaults(testimonialsManifest),
  [accordionManifest.type]: getBrickManifestDefaults(accordionManifest),
  [htmlManifest.type]: getBrickManifestDefaults(htmlManifest),
  [tableManifest.type]: getBrickManifestDefaults(tableManifest),
  [tabsManifest.type]: getBrickManifestDefaults(tabsManifest),
  [timelineManifest.type]: getBrickManifestDefaults(timelineManifest),
};

// Do not include footer, navbar and sidebar
export const brickTypes = StringEnum<(keyof typeof manifests)[]>(
  [
    textManifest.type,
    heroManifest.type,
    imageManifest.type,
    videoManifest.type,
    cardManifest.type,
    mapManifest.type,
    formManifest.type,
    imagesWallManifest.type,
    carouselManifest.type,
    buttonManifest.type,
    iconManifest.type,
    socialLinksManifest.type,
    boxManifest.type,
    spacerManifest.type,
    testimonialsManifest.type,
    accordionManifest.type,
    htmlManifest.type,
    tableManifest.type,
    tabsManifest.type,
    timelineManifest.type,
  ],
  {
    title: "Brick type",
  },
);

export type BrickType = Static<typeof brickTypes>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const examples: Record<string, { description: string; type: string; props: any }[]> = {
  [textManifest.type]: textExamples,
  [heroManifest.type]: heroExamples,
  [imageManifest.type]: imageExamples,
  [videoManifest.type]: videoExamples,
  [cardManifest.type]: cardExamples,
  [mapManifest.type]: mapExamples,
  [formManifest.type]: formExamples,
  [sidebarManifest.type]: sidebarExamples,
  [imagesWallManifest.type]: imagesWallExamples,
  [carouselManifest.type]: carouselExamples,
  [navbarManifest.type]: navbarExamples,
  [footerManifest.type]: footerExamples,
  [buttonManifest.type]: buttonExamples,
  [iconManifest.type]: iconExamples,
  [socialLinksManifest.type]: socialLinksExamples,
  [boxManifest.type]: boxExamples,
  [spacerManifest.type]: spacerExamples,
  [testimonialsManifest.type]: testimonialsExamples,
  [accordionManifest.type]: accordionExamples,
  [htmlManifest.type]: htmlExamples,
  [tableManifest.type]: tableExamples,
  [tabsManifest.type]: tabsExamples,
  [timelineManifest.type]: timelineExamples,
};
