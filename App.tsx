import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Cell from './src/components/Cell';
import { theme } from './src/theme';

export default function App() {
  const [currentTurn, setCurrentTurn] = useState('x');
  const [map, setMap] = useState([
    ['', '', ''], // 1st row
    ['', '', ''], // 2nd row
    ['', '', ''], // 3rd row
  ]);
  const [gameMode, setGameMode] = useState('BOT_MEDIUM'); // LOCAL, BOT_EASY, BOT_MEDIUM;

  useEffect(() => {
    if (currentTurn === 'o' && gameMode !== 'LOCAL') {
      botTurn();
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(map);
    if (winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }
  }, [map]);

  const copyArray = (original: any) => {
    console.log('ghe');
    console.log(original);
    const copy = original.map((arr: any) => {
      return arr.slice();
    });
    console.log(copy);
    return copy;
  };

  const onPress = (rowIndex: number, columnIndex: number) => {
    if (map[rowIndex][columnIndex] !== '') {
      Alert.alert('Position already occupied');
      return;
    }

    setMap((existingMap: Array<any>) => {
      const updatedMap = [...existingMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });

    setCurrentTurn(currentTurn === 'x' ? 'o' : 'x');
  };

  const getWinner = (winnerMap: Array<any>) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      let isRowXWinning = winnerMap[i].every((cell: string) => cell === 'x');
      let isRowOWinning = winnerMap[i].every((cell: string) => cell === 'o');
      if (isRowXWinning) {
        return 'x';
      }
      if (isRowOWinning) {
        return 'o';
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      let columnXWinner = true;
      let columnOWinner = true;

      for (let row = 0; row < 3; row++) {
        if (winnerMap[row][col] !== 'x') {
          columnXWinner = false;
        }
        if (winnerMap[row][col] !== 'o') {
          columnOWinner = false;
        }
      }

      if (columnXWinner) {
        return 'x';
      }

      if (columnOWinner) {
        return 'o';
      }
    }

    //Check diagonals
    let isDiagonalXWinning = true;
    let isDiagonalOWinning = true;
    let isDiagonal2XWinning = true;
    let isDiagonal2OWinning = true;

    for (let i = 0; i < 3; i++) {
      if (winnerMap[i][i] !== 'o') {
        isDiagonalOWinning = false;
      }
      if (winnerMap[i][i] !== 'x') {
        isDiagonalXWinning = false;
      }

      if (winnerMap[i][2 - i] !== 'o') {
        isDiagonal2OWinning = false;
      }
      if (winnerMap[i][2 - i] !== 'x') {
        isDiagonal2XWinning = false;
      }
    }

    if (isDiagonalXWinning || isDiagonal2XWinning) {
      return 'x';
    }

    if (isDiagonalOWinning || isDiagonal2OWinning) {
      return 'o';
    }
  };

  const gameWon = (player: string) => {
    Alert.alert(`Hurraaay!!!`, `Player ${player} won`, [
      {
        text: 'Restart',
        onPress: resetGame,
      },
    ]);
  };

  const resetGame = () => {
    setMap([
      ['', '', ''], // 1st row
      ['', '', ''], // 2nd row
      ['', '', ''], // 3rd row
    ]);
    setCurrentTurn('x');
  };

  const botTurn = () => {
    // collect all possible options
    const possiblePositions: Array<any> = [];
    map.forEach((row: any, rowIndex: number) => {
      row.forEach((cell: any, columnIndex: number) => {
        if (cell === '') {
          possiblePositions.push({ row: rowIndex, col: columnIndex });
        }
      });
    });

    let chosenOption;

    if (gameMode === 'BOT_MEDIUM') {
      // Attack
      possiblePositions.forEach((possiblePosition) => {
        const mapCopy = copyArray(map);

        mapCopy[possiblePosition.row][possiblePosition.col] = 'o';

        const winner = getWinner(mapCopy);
        if (winner === 'o') {
          // Attack that position
          chosenOption = possiblePosition;
        }
      });

      if (!chosenOption) {
        // Defend
        // Check if the opponent WINS if it takes one of the possible Positions
        possiblePositions.forEach((possiblePosition) => {
          const mapCopy = copyArray(map);

          mapCopy[possiblePosition.row][possiblePosition.col] = 'x';

          const winner = getWinner(mapCopy);
          if (winner === 'x') {
            // Defend that position
            chosenOption = possiblePosition;
          }
        });
      }
    }

    // choose random
    if (!chosenOption) {
      chosenOption =
        possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }

    if (chosenOption) {
      onPress(chosenOption.row, chosenOption.col);
    }
  };

  const checkTieState = () => {
    if (!map.some((row) => row.some((cell) => cell === ''))) {
      Alert.alert(`It's a tie`, `tie`, [
        {
          text: 'Restart',
          onPress: resetGame,
        },
      ]);
    }
  };
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 24,
          color: 'white',
          position: 'absolute',
          top: 100,
        }}
      >
        Current Turn: {currentTurn.toUpperCase()}
      </Text>
      <View style={styles.map}>
        {map.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, columnIndex) => (
              <Cell
                key={`row-${rowIndex}--col-${columnIndex}`}
                cell={cell}
                onPress={() => onPress(rowIndex, columnIndex)}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.buttons}>
        <Text
          onPress={() => setGameMode('LOCAL')}
          style={[
            styles.button,
            { backgroundColor: gameMode === 'LOCAL' ? '#4F5686' : '#191F24' },
          ]}
        >
          Local
        </Text>
        <Text
          onPress={() => setGameMode('BOT_EASY')}
          style={[
            styles.button,
            {
              backgroundColor: gameMode === 'BOT_EASY' ? '#4F5686' : '#191F24',
            },
          ]}
        >
          Easy Bot
        </Text>
        <Text
          onPress={() => setGameMode('BOT_MEDIUM')}
          style={[
            styles.button,
            {
              backgroundColor:
                gameMode === 'BOT_MEDIUM' ? '#4F5686' : '#191F24',
            },
          ]}
        >
          Medium Bot
        </Text>
      </View>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundColor,
  },
  bg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  map: {
    borderWidth: 1,
    borderColor: '#fff',
    aspectRatio: 1,
    width: '80%',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  buttons: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
  },
  button: {
    color: 'white',
    margin: 10,
    fontSize: 16,
    backgroundColor: theme.buttonColor,
    padding: 10,
    paddingHorizontal: 15,
  },
});
