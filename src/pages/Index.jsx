import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";

const BIRD_SIZE = 20;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

const Bird = ({ birdPosition }) => <Box position="absolute" top={birdPosition} width={BIRD_SIZE} height={BIRD_SIZE} bgColor="yellow.500" borderRadius="full" />;

const Obstacle = ({ obstacleHeight, left }) => (
  <>
    <Box position="absolute" top={0} left={left} width={OBSTACLE_WIDTH} height={obstacleHeight} bgColor="green.500" />
    <Box position="absolute" top={obstacleHeight + OBSTACLE_GAP} left={left} width={OBSTACLE_WIDTH} height="100%" bgColor="green.500" />
  </>
);

const Index = () => {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(500);
  const [score, setScore] = useState(0);
  const bottomObstacleHeight = 500 - OBSTACLE_GAP - obstacleHeight;
  const gameContainerRef = useRef(null);

  const startGame = () => {
    setGameHasStarted(true);
    setBirdPosition(250);
    setObstacleLeft(500);
    setScore(0);
  };

  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < 480) {
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + GRAVITY);
      }, 24);
    }

    return () => {
      clearInterval(timeId);
    };
  }, [birdPosition, gameHasStarted]);

  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 24);

      return () => {
        clearInterval(obstacleId);
      };
    } else {
      setObstacleLeft(500);
      setObstacleHeight(Math.floor(Math.random() * (400 - 100) + 100));
      setScore((score) => score + 1);
    }
  }, [gameHasStarted, obstacleLeft]);

  useEffect(() => {
    const hasCollidedWithTopObstacle = birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollidedWithBottomObstacle = birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight;

    if (obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle)) {
      setGameHasStarted(false);
    }
  }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);

  const handleClick = () => {
    let newBirdPosition = birdPosition - JUMP_HEIGHT;
    if (!gameHasStarted) {
      startGame();
    } else if (newBirdPosition < 0) {
      setBirdPosition(0);
    } else {
      setBirdPosition(newBirdPosition);
    }
  };

  return (
    <VStack spacing={4} ref={gameContainerRef} onClick={handleClick}>
      <Text fontSize="6xl" fontWeight="bold">
        {score}
      </Text>
      <Box position="relative" width="500px" height="500px" bgColor="blue.500">
        <Bird birdPosition={birdPosition} />
        <Obstacle obstacleHeight={obstacleHeight} left={obstacleLeft} />
      </Box>
      {!gameHasStarted && (
        <Button leftIcon={<FaPlay />} colorScheme="green" size="lg" onClick={startGame}>
          Start Game
        </Button>
      )}
    </VStack>
  );
};

export default Index;
