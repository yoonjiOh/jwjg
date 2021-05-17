--Issues
INSERT INTO jwjg.Issues (id, title, content, imageUrl, isPublished, createdAt, updatedAt) VALUES (1, '배구 스타의 ‘학교 폭력’에 대해 어떻게 생각하세요?', '최근 배구계 스타 선수의 학교폭력 문제가 수면 위로 떠올랐죠. 스타 쌍둥이 자매가 칼을 들고 위협했다는 피해자의 호소로 시작된 사태는 대통령이 엄중 대응을 주문하며 사회적 이슈로 확산됐는데요. 칼을 들고 위협했다는 증언은 학생 때의 철없는 행동으로는 보기 힘들 정도의 충격을 줬고, 나라 전체에 공분이 커진 상황이에요. 상승세를 탔던 배구의 ', 'https://jwjg-issues.s3.ap-northeast-2.amazonaws.com/image+34.png', 1, '2021-04-14 14:05:15.803', '2021-04-14 14:05:15.803');
INSERT INTO jwjg.Issues (id, title, content, imageUrl, isPublished, createdAt, updatedAt) VALUES (2, '타이틀 변경', '테스트 콘텐트', 'https://imgnews.pstatic.net/image/005/2021/05/15/611412110015848785_1_20210515101402179.jpg?type=w647', 1, '2021-05-15 06:44:03.346', '2021-05-15 06:44:03.346');
INSERT INTO jwjg.Issues (id, title, content, imageUrl, isPublished, createdAt, updatedAt) VALUES (3, '테스트 타이틀이 길면? 테스트 타이틀이 길면? 테스트 타이틀이 길면? 테스트 타이틀이 길면? ', '테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? 테스트 콘텐츠가 길면? ', 'https://post-phinf.pstatic.net/MjAyMTA1MTRfMjE0/MDAxNjIwOTc0NDI5MzUw.-JoFkznv5kovWIa_97d4Fl8qHNhKQAIUPOQX6LWMA6sg.hMy9ui0alSGaOoO50Q4LdUclkcLD0mC8a0mV67FQjDog.JPEG/IMG_2382.JPG?type=w1200', 0, '2021-05-15 06:46:17.212', '2021-05-15 06:46:17.212');

--Users
INSERT INTO jwjg.Users (id, firebaseUID, name, intro, profileImageUrl, createdAt, updatedAt, isAdmin) VALUES (7, 'SOYAjo3XZge9lTg4gC82qwRgior1', 'tester', 'tester intro', '''ㅇㅇ''', '2021-05-12 11:46:06.655', '2021-05-12 11:46:06.655', 0);
INSERT INTO jwjg.Users (id, firebaseUID, name, intro, profileImageUrl, createdAt, updatedAt, isAdmin) VALUES (8, 'FWtqWrLaFmZnUuXYT2zy9RaY7Z72', 'tesyj', 'dd', 'dd', '2021-05-13 13:53:18.862', '2021-05-13 13:53:18.862', 0);

--Stances
INSERT INTO jwjg.Stances (id, title, orderNum, issuesId) VALUES (1, '반대', 1, 1);
INSERT INTO jwjg.Stances (id, title, orderNum, issuesId) VALUES (2, '중립', 2, 1);
INSERT INTO jwjg.Stances (id, title, orderNum, issuesId) VALUES (3, '찬성', 3, 1);

--Opinions
INSERT INTO jwjg.Opinions (id, content, createdAt, usersId, issuesId, stancesId) VALUES (1, '이것은 opinion 의견 예시이다. 배구 스타 학폭 관련에 단 opinion 의견이다.', '2021-05-13 13:28:44.946', 7, 1, 1);
INSERT INTO jwjg.Opinions (id, content, createdAt, usersId, issuesId, stancesId) VALUES (2, 'opinion 의견 예시 두 번째.', '2021-05-13 13:53:40.762', 8, 1, 2);

--OpinionReacts
INSERT INTO jwjg.OpinionReacts (`like`, usersId, opinionsId) VALUES (1, 7, 1);
INSERT INTO jwjg.OpinionReacts (`like`, usersId, opinionsId) VALUES (0, 8, 1);

--UserStances
INSERT INTO jwjg.UserStances (usersId, issuesId, stancesId) VALUES (7, 1, 1);

--OpinionComments
INSERT INTO jwjg.OpinionComments (id, content, createdAt, usersId, opinionsId, stancesId) VALUES (1, '이것은 opinion comment 예시 이다. ', '2021-05-13 13:32:41.814', 7, 1, 2);
INSERT INTO jwjg.OpinionComments (id, content, createdAt, usersId, opinionsId, stancesId) VALUES (2, '이것은 opinion comment 예시 두 번째ㅔ이다. ', '2021-05-13 13:54:05.701', 8, 1, 3);
INSERT INTO jwjg.OpinionComments (id, content, createdAt, usersId, opinionsId, stancesId) VALUES (3, '댓글 입력 테스트 아아', '2021-05-13 14:56:52.360', 7, 1, 1);

--OpinionCommentReacts
INSERT INTO jwjg.OpinionCommentReacts (`like`, usersId, opinionCommentsId) VALUES (1, 7, 1);

--Hashtags
INSERT INTO jwjg.HashTags (id, content) VALUES (1, '사회');

--IssueHashTags
INSERT INTO jwjg.IssueHashTags (issuesId, hashTagsId) VALUES (1, 1);