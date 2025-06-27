Instalare si rulare:

npm install -g expo-cli
git clone https://github.com/FabianCotolan/FootballApp.git
npm install
npm start
npx expo start

Instalare prealabila si Expo Go pe telefon.

Fisierele din repo:
App.js – punct de intrare in aplicatie, defineste navigatia principala React Navigation
package.json – listeaza toate pachetele si script-urile utilizate
assets – imagini, video, elemente UI
app.json – fisier de configurare pentru Expo

Comenzi de instalare pentru pachetele principale:
npm install firebase @react-native-firebase/app @react-native-firebase/auth
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/stack
npx expo install expo-camera expo-av
npm install @react-native-community/datetimepicker
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native
npx expo install expo-gl
