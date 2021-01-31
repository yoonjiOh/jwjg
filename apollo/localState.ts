import { makeVar, InMemoryCache } from '@apollo/client';
import { Post } from '../models/Post';

export const cache: InMemoryCache = new InMemoryCache({});

// 이건 지금은 쓰이진 않지만 혹시 앞으로 참고할 수 있어서 살려둠 BY yoonji
const postInitialValue: Post = { title: '', content: '', option_list: {}};
export const new_issue_var = makeVar<Post>(postInitialValue);

export const local_state = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				new_issue: {
					read() {
						return new_issue_var();
					}
				}
			}
		}
	}
});
