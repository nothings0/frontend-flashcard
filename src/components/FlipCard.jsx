import { useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform
} from "framer-motion";

function Card({ item, total, frontCard, setIndex, drag }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [exitX, setExitX] = useState(0);

  const x = useMotionValue(0);
  const scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const rotate = useTransform(x, [-150, 0, 150], [-45, 0, 45], {
    clamp: false
  });

  const handleDragEnd = useCallback((_, info) => {
    if (info.offset.x < -100) {
      setExitX(-400);
      setIndex((prev) => (prev - 1 + total) % total);
    } else if (info.offset.x > 100) {
      setExitX(400);
      setIndex((prev) => (prev + 1) % total);
    }
  }, [setIndex, total]);

  const cardVariants = {
    animate: { scale: 1, y: 0, opacity: 1 },
    exit: (custom) => ({
      x: custom,
      opacity: 0.1,
      scale: 0.6,
      transition: { duration: 0.35 }
    }),
    initial: { scale: 0, y: 105, opacity: 0 }
  };

  if (!item) return null;

  const cardSizeStyle = {
    width: "clamp(260px, 50vw, 380px)",
    height: "clamp(260px, 50vw, 380px)"
  };

  const sharedCardFaceStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 500,
    padding: 20,
    backgroundColor: "var(--second-bg)",
    backfaceVisibility: "hidden"
  };

  return (
    <motion.div
      style={{
        ...cardSizeStyle,
        position: "absolute",
        top: 0,
        x,
        rotate,
        scale,
        cursor: "pointer",
        perspective: 1000
      }}
      drag={drag}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onDoubleClick={() => setIsFlipped(!isFlipped)}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      custom={exitX}
      transition={
        frontCard
          ? { type: "spring", stiffness: 300, damping: 20 }
          : { scale: { duration: 0.2 }, opacity: { duration: 0.4 } }
      }
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)"
        }}
      >
        {/* Front side */}
        <div style={sharedCardFaceStyle}>
          {item.prompt}
        </div>

        {/* Back side */}
        <div
          style={{
            ...sharedCardFaceStyle,
            transform: "rotateX(180deg)"
          }}
        >
          {item.answer}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FlipCard({ data }) {
  const [index, setIndex] = useState(0);

  const current = data[index % data.length];
  const next = data[(index + 1) % data.length];

  return (
    <motion.div
      style={{
        width: "clamp(260px, 50vw, 380px)",
        height: "clamp(260px, 50vw, 380px)",
        position: "relative",
        margin: "0 auto"
      }}
    >
      <AnimatePresence initial={false}>
        <Card key={index + 1} item={next} frontCard={false} />
        <Card
          key={index}
          item={current}
          frontCard={true}
          index={index}
          setIndex={setIndex}
          drag="x"
          total={data.length}
        />
      </AnimatePresence>
    </motion.div>
  );
}
