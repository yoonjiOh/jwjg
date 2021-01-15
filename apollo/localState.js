import { InMemoryCache } from 'apollo-cache-inmemory'
import { makeVar } from '@apollo/client';

export const new_issue_var = makeVar({ issue_title: '', issue_detail: '' });

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
