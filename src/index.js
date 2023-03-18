import './js/visual';
import './js/scroll';
import { getUserData } from './js/axios';

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";


const DEBOUNCE_DELAY = 300;
