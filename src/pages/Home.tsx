// Top-level step flow through all sections. Exports Home.
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { prefetchAllContent } from "../lib/content";
import { Envelope } from "../components/Envelope";
import { Timeline } from "../components/Timeline";
import { PhotoMuseum } from "../components/PhotoMuseum";
import { MemoryJar } from "../components/MemoryJar";
// section hidden: LoveCards (re-add the import to bring it back)
// import { LoveCards } from "../components/LoveCards";
import { SongSection } from "../components/SongSection";
// section removed: CoupleQuiz (re-add the import to bring it back)
// import { CoupleQuiz } from "../components/CoupleQuiz";
// section hidden: OpenWhen (re-add the import to bring it back)
// import { OpenWhen } from "../components/OpenWhen";
// section removed: VoiceMessage (re-add the import to bring it back)
// import { VoiceMessage } from "../components/VoiceMessage";
// section hidden: SecretSection (re-add the import to bring it back)
// import { SecretSection } from "../components/SecretSection";
import { FinalSection } from "../components/FinalSection";
import { GiftReveal } from "../components/GiftReveal";
// section hidden: NotToldYouYet (re-add the import to bring it back)
// import { NotToldYouYet } from "../components/NotToldYouYet";
// section hidden: FutureMemories (re-add the import to bring it back)
// import { FutureMemories } from "../components/FutureMemories";
import { EndScreen } from "../components/EndScreen";
import { ProgressIndicator } from "../components/ui/ProgressIndicator";
import { MusicToggle } from "../components/ui/MusicToggle";

const STEPS = [
  "opening",
  "timeline",
  "museum",
  "memoryJar",
  // "thingsILove", // section hidden — uncomment to bring back
  "songs",
  // "quiz", // section removed — uncomment to bring back
  // "openWhen", // section hidden — uncomment to bring back
  // "voiceMessage", // section removed — uncomment to bring back
  // "secret", // section hidden — uncomment to bring back
  "finalLetter",
  "giftReveal",
  // "notToldYouYet", // section hidden — uncomment to bring back
  // "futureMemories", // section hidden — uncomment to bring back
  "end",
] as const;

// steps that count toward the little "♡ 03 / 14" progress indicator
const COUNTED_STEPS = STEPS.filter((s) => s !== "opening" && s !== "end");

export function Home() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }
  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }
  function restart() {
    setStepIndex(0);
  }

  // warms the DB content cache while the visitor is still on the envelope
  useEffect(() => {
    prefetchAllContent();
  }, []);

  const countedPosition = COUNTED_STEPS.indexOf(step as (typeof COUNTED_STEPS)[number]);
  const showProgress = countedPosition !== -1;

  return (
    <div className="relative min-h-screen w-full bg-ivory">
      {showProgress && (
        <ProgressIndicator
          index={countedPosition + 1}
          total={COUNTED_STEPS.length}
          onPrev={goBack}
          onNext={goNext}
          canGoBack={stepIndex > 0}
          canGoForward={stepIndex < STEPS.length - 1}
        />
      )}
      <MusicToggle />

      <AnimatePresence mode="wait">
        {step === "opening" && <Envelope key="opening" onOpened={goNext} />}
        {step === "timeline" && <Timeline key="timeline" onNext={goNext} />}
        {step === "museum" && <PhotoMuseum key="museum" onNext={goNext} />}
        {step === "memoryJar" && <MemoryJar key="memoryJar" onNext={goNext} />}
        {/* section hidden: LoveCards — uncomment along with the import and STEPS entry to bring back */}
        {/* {step === "thingsILove" && <LoveCards key="thingsILove" onNext={goNext} />} */}
        {step === "songs" && <SongSection key="songs" onNext={goNext} />}
        {/* section removed: CoupleQuiz — uncomment along with the import and STEPS entry to bring back */}
        {/* {step === "quiz" && <CoupleQuiz key="quiz" onNext={goNext} />} */}
        {/* section hidden: OpenWhen — uncomment along with the import and STEPS entry to bring back */}
        {/* {step === "openWhen" && <OpenWhen key="openWhen" onNext={goNext} />} */}
        {/* section removed: VoiceMessage — uncomment along with the import and STEPS entry to bring back */}
        {/* {step === "voiceMessage" && <VoiceMessage key="voiceMessage" onNext={goNext} />} */}
        {/* section hidden: SecretSection — uncomment along with the import and STEPS entry to bring back */}
        {/* {step === "secret" && <SecretSection key="secret" onNext={goNext} />} */}
        {step === "finalLetter" && <FinalSection key="finalLetter" onNext={goNext} />}
        {step === "giftReveal" && <GiftReveal key="giftReveal" onNext={goNext} />}
        {/* section hidden: NotToldYouYet — uncomment along with the import and STEPS entry to bring back */}
        {/* {step === "notToldYouYet" && <NotToldYouYet key="notToldYouYet" onNext={goNext} />} */}
        {/* section hidden: FutureMemories — uncomment along with the import and STEPS entry to bring back */}
        {/* {step === "futureMemories" && <FutureMemories key="futureMemories" onNext={goNext} />} */}
        {step === "end" && <EndScreen key="end" onRestart={restart} />}
      </AnimatePresence>
    </div>
  );
}
