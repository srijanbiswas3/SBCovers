import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import CssBaseline from '@mui/material/CssBaseline';

function App() {

  const defaultTheme = createTheme();
  const darkTheme = createTheme({
    ...defaultTheme,
    palette: {
      mode: 'dark',
      // Add any additional palette configuration for the dark theme here
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <GoogleOAuthProvider clientId="897631963166-m87nqn3jem25nraupltjtv82q7g1eo5h.apps.googleusercontent.com">
        <div className="App">
          <Header />
          <Home />
          <Footer />
        </div>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
