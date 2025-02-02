# Guessing Number Game

I have created a Number guessing game. It is not some typical number guessing game where computer will generate a random number and you have to guess it. 

In this game user has to guess the number which is average of all the guessed numbers.
[Link to the game](https://gng.pixismith.com/)

## Logic of the game

- Initially there is a number `x` in the database.
- User has to guess the number `x`, which should be in the range of `1-1000`.
- If the guessed number is correct then user wins the game.
- If the guessed number is wrong then a new number `y` is generated which is `Round((x + guessed number)/2)`.
- If that number ever falls between `0-10` or `990-1000` then a new unique number is generated.
- User can guess the number once in 5 seconds.
- Only first 5 users to guess the number will be considered as winners.

# Tech Stack
- Frontend: ReactJS, Typescript, Vite and SASS (No Fancy frameworks)
- Backend: NodeJS, ExpressJS, Fire Store 
(You may ask why fireStore, because it is free and I am a student 😅)
(Literally I have used firestone for everything even for rate limiting the user requests 😂. And the score is a singe field in the database so I even used transaction in fireStore.)
- Authentication: Firebase (I am too lazy to write another authentication service from scratch and waste my 2-3 days and still it will have bugs 😅)

*Why authentication ?? If not then how will I know which is winner*

- Hosting: Firebase Hosting, GCP cloud run (For the backend which is just a magic of Google) and API gateway (I will explain it another post why I used it)

## Links

- [Game](https://gng.pixismith.com/)
- [Backend Github](https://github.com/SBRakeshRath/guessing-number-game-backend)
- [Frontend Github](https://github.com/SBRakeshRath/guessing-number-game-frontend)

