"use strict";

import { BASE_URL, requestOptions } from './common.js';

const usersAPI = {
    getCurrent: async function () {
        const response = await axios.get(`${BASE_URL}/users/current`, requestOptions);
        return response.data[0];
    }
};

export { usersAPI };