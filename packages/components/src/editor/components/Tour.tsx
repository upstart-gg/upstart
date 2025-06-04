import Joyride, { STATUS, type CallBackProps } from "react-joyride";
import { tours } from "../tours";
import { useLocalStorage } from "usehooks-ts";

export default function Tour() {
  const [seenTours, setSeenTours] = useLocalStorage<string[]>("seen_tours", []);
  const [toursDisabled, setToursDisabled] = useLocalStorage<boolean>("tours_disabled", false);

  if (toursDisabled) {
    return null;
  }

  const selectedTour = Object.entries(tours).find(([tourId]) => !seenTours.includes(tourId));
  const [tourId, steps] = selectedTour || [];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (tourId && (status === STATUS.FINISHED || status === STATUS.SKIPPED)) {
      setSeenTours((prev) => [...prev, tourId]);
    }
  };

  if (tourId && steps) {
    return (
      <Joyride
        steps={steps}
        callback={handleJoyrideCallback}
        continuous
        showSkipButton={true}
        hideCloseButton={true}
        locale={{
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          nextLabelWithProgress: "Next ({step}/{steps})",
          skip: "Skip tour",
        }}
        styles={{
          buttonNext: {
            backgroundColor: "#7270c6",
            padding: "0.7rem 2rem",
            borderRadius: "0.25rem",
          },
          buttonBack: {
            padding: "0.7rem 2rem",
            backgroundColor: "#EFEFEF",
            borderRadius: "0.25rem",
            color: "#333",
          },
          buttonSkip: {
            padding: "0.7rem 1rem",
            backgroundColor: "#E5E5E5",
            borderRadius: "0.25rem",
            color: "#333",
            width: "auto",
          },
          buttonClose: {
            scale: 0.7,
            borderRadius: "0.25rem",
            padding: "10px",
          },
          tooltip: {
            fontFamily: "inherit",
            padding: "0",
            borderRadius: "0.50rem",
          },
          tooltipFooter: {
            padding: "0.5rem",
            backgroundColor: "#f9f9f9",
            borderTop: "1px solid #e5e5e5",
            borderBottomLeftRadius: "0.5rem",
            borderBottomRightRadius: "0.5rem",
          },
          tooltipTitle: {
            textAlign: "left",
            fontWeight: "500",
            fontSize: "1rem",
            padding: "1rem 1rem 0 1rem",
            fontFamily: "inherit",
          },
          tooltipContent: {
            textAlign: "left",
            padding: "1rem",
            fontFamily: "inherit",
            fontSize: "0.9rem",
          },
        }}
      />
    );
  }

  return null;
}
