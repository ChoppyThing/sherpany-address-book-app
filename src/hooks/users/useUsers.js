import { useState } from 'react';
import fetchUsers from '../../api/users';

const BATCH_SIZE = 50;
const MAX_ITEMS = 200;

const useUsers = () => {
  const [state, setState] = useState({
    users: [],
    nextUsers: [],
    currentPage: 1,
    hasLoaded: false,
  });

  const getUsers = async (page) => {
    const newNextUsers = fetchUsers(page, BATCH_SIZE);

    return newNextUsers;
  };

  const isLastPage = (page) => page * BATCH_SIZE >= MAX_ITEMS;

  /**
   * Load more users
   */
  const loadMore = () => {
    const fetchData = async () => {
      let nextUsersList;

      if (state.currentPage === 1) {
        nextUsersList = await getUsers(state.currentPage);
      } else {
        nextUsersList = await state.nextUsers;
      }

      const newState = {
        ...state,
        users: [...state.users, ...nextUsersList],
        currentPage: state.currentPage + 1,
        hasLoaded: true,
      };

      // Only load next users if we are not on the last page
      if (!isLastPage(state.currentPage)) {
        newState.nextUsers = getUsers(state.currentPage + 1);
      }

      setState(newState);
    };

    fetchData();
  };

  return {
    hasLoaded: state.hasLoaded,
    users: state.users,
    loadMore,
    hasMore: !isLastPage(state.currentPage),
  };
};

export default useUsers;