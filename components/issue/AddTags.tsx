import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import style from '../../pages/admin/issues/new.module.css';

const CREATE_TAG = gql`
  mutation createTag($name: String!) {
    createTag(name: $name) {
      id
      name
    }
  }
`;

const AddTags = ({
  selected_tags,
  tags,
  dispatch
 }) => {
  const [addTagErr, setAddTagErr] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [createTag] = useMutation(CREATE_TAG);


  const handleChangeTagInput = value => {
    setAddTagErr(null);
    setNewTag(value);
  };

  const handleSelectTag = e => {
    dispatch({
      type: 'SET_HASHTAGS',
      tag: { id: e.target.id, value: +e.target.value },
    });
  };

  const handleClickAddTagBtn = async () => {
    if (newTag.length === 0) {
      return setAddTagErr('태그명을 입력해주세요');
    }

    if (
      tags.find(tag => {
        return tag.name === newTag.trim();
      })
    ) {
      return setAddTagErr('이미 등록되어 있는 태그 입니다.');
    }

    try {
      await createTag({
        variables: {
          name: newTag,
        },
      }).then(result => {
        dispatch({
          type: 'ADD_HASHTAG',
          tag: {
            id: result.data.createTag.id,
            name: result.data.createTag.name,
          },
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div>선택된 태그: {selected_tags && selected_tags.map(tag => tag.id).join(', ')}</div>

      <div className={style.title_sm} style={{ marginBottom: '15px' }}>
        태그 선택
          </div>

      <select name="tag" multiple id="tag-select" className={style.select}>
        {tags &&
          tags.map(tag => {
            const isSelected = selected_tags && selected_tags.filter(t => t.value === tag.id).length;

            return (
              <option
                onClick={handleSelectTag}
                disabled={!!isSelected}
                id={tag.name}
                value={tag.id}
                key={tag.id}
              >
                {tag.name}
              </option>
            );
          })}
      </select>

      <div className={style.title_sm} style={{ margin: '15px 0' }}>
        태그 추가
      </div>

      <div className={style.option_wrapper}>
        <p style={{ color: 'red' }}>{addTagErr}</p>
        <input onChange={e => handleChangeTagInput(e.target.value)} />
        <button onClick={handleClickAddTagBtn}>+</button>
      </div>
    </div>
  )
}

export default AddTags;