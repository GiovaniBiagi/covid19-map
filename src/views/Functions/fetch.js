import apiConfig from '../../services/api';

export async function fetchCovidApi(url) {
    const response = await apiConfig.get(`/${url}`);
    return response;
}