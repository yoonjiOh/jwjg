import { makeVar, InMemoryCache } from '@apollo/client';
import { Post } from '../models/Post';

export const cache: InMemoryCache = new InMemoryCache({});

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
