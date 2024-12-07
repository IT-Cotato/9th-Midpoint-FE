export const FROM_ALONE_RESULT = 'aloneResult';
export const FROM_EACH_RESULT = 'eachResult';
export const FROM_ENTER_ALONE = 'enterAlone';
export const FROM_ENTER_EACH = 'enterEach';

export const FROM_ALONE_CREATE_VOTE_PLACE = 'createPlaceVoteAlone';
export const FROM_ALONE_PLACE_VOTE = 'votePlaceAlone';
export const FROM_ALONE_PLACE_VOTE_RESULT = 'alonePlaceVoteResult';

export const FROM_EACH_CREATE_VOTE_PLACE = 'createPlaceVoteEach';
export const FROM_EACH_PLACE_VOTE = 'votePlacesEach';
export const FROM_EACH_PLACE_VOTE_RESULT = 'eachPlaceVoteResult';

export const FROM_ALONE_CREATE_VOTE_TIME = 'createTimeVoteAlone';
export const FROM_ALONE_TIME_VOTE = 'voteTimeAlone';
export const FROM_ALONE_TIME_VOTE_RESULT = 'aloneTimeVoteResult';

export const FROM_EACH_CREATE_VOTE_TIME = 'createTimeVoteEach';
export const FROM_EACH_TIME_VOTE = 'voteTimeEach';
export const FROM_EACH_TIME_VOTE_RESULT = 'eachTimeVoteResult';

export const ROOM_TYPE_ALONE = 'SELF';
export const ROOM_TYPE_EACH = 'TOGETHER';

//refactor

export const QUERY_KEYS = {
  FROM_ENTER: 'enter',
  FROM_RESULT: 'result',

  PLACE_RECOMMEND: 'palceRecommend',
  PLACE_ALL: 'ALL' as 'ALL',
  PLACE_STUDY: 'STUDY' as 'STUDY',
  PLACE_CAFE: 'CAFE' as 'CAFE',
  PLACE_RESTAURANT: 'RESTAURANT' as 'RESTAURANT',

  FROM_CREATE_PLACE_VOTE: 'createPlaceVote',
  FROM_PLACE_VOTE: 'votePlace',
  FROM_RESULT_PLACE_VOTE: 'resultPlaceVote',

  FROM_CREATE_TIME_VOTE: 'createTimeVote',
  FROM_TIME_VOTE: 'voteTime',
  FROM_RESULT_TIME_VOTE: 'resultTimeVote',

  IS_EXISTS_ROOM: 'roomExists',
  IS_EXISTS_PLACEVOTE_ROOM: 'placeVoteRoomExists',
  IS_EXISTS_TIMEVOTE_ROOM: 'timeVoteRoomExists',

  IS_VOTED: 'isVoted',
};
