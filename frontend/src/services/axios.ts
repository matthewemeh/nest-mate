import axios, { AxiosInstance } from 'axios';
import Endpoints from './Endpoints';

const { BASE_URL } = Endpoints;

const instance: AxiosInstance = axios.create({ baseURL: BASE_URL });

export default instance;
