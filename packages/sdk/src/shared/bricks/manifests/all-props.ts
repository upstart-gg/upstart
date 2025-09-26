import { manifest as accordionManifest } from "./accordion.manifest";
import { manifest as boxManifest } from "./box.manifest";
import { manifest as buttonManifest } from "./button.manifest";
import { manifest as cardManifest } from "./card.manifest";
import { manifest as carouselManifest } from "./carousel.manifest";
import { manifest as footerManifest } from "./footer.manifest";
import { manifest as formManifest } from "./form.manifest";
import { manifest as heroManifest } from "./hero.manifest";
import { manifest as iconManifest } from "./icon.manifest";
import { manifest as imageManifest } from "./image.manifest";
import { manifest as imagesWallManifest } from "./images-gallery.manifest";
import { manifest as mapManifest } from "./map.manifest";
import { manifest as navbarManifest } from "./navbar.manifest";
import { manifest as sidebarManifest } from "./sidebar.manifest";
import { manifest as socialLinksManifest } from "./social-links.manifest";
import { manifest as spacerManifest } from "./spacer.manifest";
import { manifest as testimonialsManifest } from "./testimonials.manifest";
import { manifest as textManifest } from "./text.manifest";
import { manifest as videoManifest } from "./video.manifest";
import { manifest as htmlManifest } from "./html.manifest";
import { manifest as tableManifest } from "./table.manifest";
import { manifest as tabsManifest } from "./tabs.manifest";
import { manifest as timelineManifest } from "./timeline.manifest";
import { Type } from "@sinclair/typebox";

export const allBrickPropsUnion = Type.Union([
  Type.Object({
    id: Type.String(),
    type: Type.Literal(textManifest.type),
    props: textManifest.props,
    mobileProps: Type.Optional(Type.Partial(textManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(heroManifest.type),
    props: heroManifest.props,
    mobileProps: Type.Optional(Type.Partial(heroManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(imageManifest.type),
    props: imageManifest.props,
    mobileProps: Type.Optional(Type.Partial(imageManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(videoManifest.type),
    props: videoManifest.props,
    mobileProps: Type.Optional(Type.Partial(videoManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(cardManifest.type),
    props: cardManifest.props,
    mobileProps: Type.Optional(Type.Partial(cardManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(mapManifest.type),
    props: mapManifest.props,
    mobileProps: Type.Optional(Type.Partial(mapManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(formManifest.type),
    props: formManifest.props,
    mobileProps: Type.Optional(Type.Partial(formManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(sidebarManifest.type),
    props: sidebarManifest.props,
    mobileProps: Type.Optional(Type.Partial(sidebarManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(imagesWallManifest.type),
    props: imagesWallManifest.props,
    mobileProps: Type.Optional(Type.Partial(imagesWallManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(carouselManifest.type),
    props: carouselManifest.props,
    mobileProps: Type.Optional(Type.Partial(carouselManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(navbarManifest.type),
    props: navbarManifest.props,
    mobileProps: Type.Optional(Type.Partial(navbarManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(footerManifest.type),
    props: footerManifest.props,
    mobileProps: Type.Optional(Type.Partial(footerManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(buttonManifest.type),
    props: buttonManifest.props,
    mobileProps: Type.Optional(Type.Partial(buttonManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(iconManifest.type),
    props: iconManifest.props,
    mobileProps: Type.Optional(Type.Partial(iconManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(socialLinksManifest.type),
    props: socialLinksManifest.props,
    mobileProps: Type.Optional(Type.Partial(socialLinksManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(boxManifest.type),
    props: boxManifest.props,
    mobileProps: Type.Optional(Type.Partial(boxManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(spacerManifest.type),
    props: spacerManifest.props,
    mobileProps: Type.Optional(Type.Partial(spacerManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(testimonialsManifest.type),
    props: testimonialsManifest.props,
    mobileProps: Type.Optional(Type.Partial(testimonialsManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(accordionManifest.type),
    props: accordionManifest.props,
    mobileProps: Type.Optional(Type.Partial(accordionManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(htmlManifest.type),
    props: htmlManifest.props,
    mobileProps: Type.Optional(Type.Partial(htmlManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(tableManifest.type),
    props: tableManifest.props,
    mobileProps: Type.Optional(Type.Partial(tableManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(tabsManifest.type),
    props: tabsManifest.props,
    mobileProps: Type.Optional(Type.Partial(tabsManifest.props)),
  }),
  Type.Object({
    id: Type.String(),
    type: Type.Literal(timelineManifest.type),
    props: timelineManifest.props,
    mobileProps: Type.Optional(Type.Partial(timelineManifest.props)),
  }),
]);
