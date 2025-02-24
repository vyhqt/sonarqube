/*
 * SonarQube
 * Copyright (C) 2009-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import styled from '@emotion/styled';
import {
  DangerButtonPrimary,
  DestructiveIcon,
  HtmlFormatter,
  InteractiveIcon,
  LightLabel,
  Modal,
  PencilIcon,
  TrashIcon,
  themeBorder,
} from 'design-system';
import * as React from 'react';
import DateTimeFormatter from '../../../components/intl/DateTimeFormatter';
import IssueChangelogDiff from '../../../components/issue/components/IssueChangelogDiff';
import LegacyAvatar from '../../../components/ui/LegacyAvatar';
import { translate, translateWithParameters } from '../../../helpers/l10n';
import { sanitizeUserInput } from '../../../helpers/sanitize';
import { Hotspot, ReviewHistoryType } from '../../../types/security-hotspots';
import { getHotspotReviewHistory } from '../utils';
import HotspotCommentModal from './HotspotCommentModal';

export interface HotspotReviewHistoryProps {
  hotspot: Hotspot;
  onDeleteComment: (key: string) => void;
  onEditComment: (key: string, comment: string) => void;
}

export default function HotspotReviewHistory(props: HotspotReviewHistoryProps) {
  const { hotspot } = props;
  const history = getHotspotReviewHistory(hotspot);
  const [editCommentKey, setEditCommentKey] = React.useState('');
  const [deleteCommentKey, setDeleteCommentKey] = React.useState('');

  return (
    <ul>
      {history.map((historyElt, historyIndex) => {
        const { user, type, diffs, date, html, key, updatable, markdown } = historyElt;
        return (
          <li className="sw-p-2 sw-body-sm" key={historyIndex}>
            <div className="sw-body-sm-highlight sw-mb-1">
              <DateTimeFormatter date={date} />
            </div>
            <LightLabel as="div" className="sw-flex sw-gap-2">
              {user.name && (
                <div className="sw-flex sw-items-center sw-gap-1">
                  <LegacyAvatar hash={user.avatar} name={user.name} size={20} />
                  <span className="sw-body-sm-highlight">
                    {user.active ? user.name : translateWithParameters('user.x_deleted', user.name)}
                  </span>
                </div>
              )}

              {type === ReviewHistoryType.Creation && translate('hotspots.review_history.created')}

              {type === ReviewHistoryType.Comment &&
                translate('hotspots.review_history.comment_added')}
            </LightLabel>

            {type === ReviewHistoryType.Diff && diffs && (
              <div className="sw-mt-2">
                {diffs.map((diff, diffIndex) => (
                  <IssueChangelogDiff diff={diff} key={diffIndex} />
                ))}
              </div>
            )}

            {type === ReviewHistoryType.Comment && key && html && markdown && (
              <div className="sw-mt-2 sw-flex sw-justify-between">
                <CommentBox
                  className="sw-pl-2 sw-ml-2 sw-body-sm"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: sanitizeUserInput(html) }}
                />

                {updatable && (
                  <div className="sw-flex sw-gap-6">
                    <InteractiveIcon
                      Icon={PencilIcon}
                      aria-label={translate('issue.comment.edit')}
                      onClick={() => setEditCommentKey(key)}
                      size="small"
                      stopPropagation={false}
                    />
                    <DestructiveIcon
                      Icon={TrashIcon}
                      aria-label={translate('issue.comment.delete')}
                      onClick={() => setDeleteCommentKey(key)}
                      size="small"
                      stopPropagation={false}
                    />
                  </div>
                )}

                {editCommentKey === key && (
                  <HotspotCommentModal
                    value={markdown}
                    onCancel={() => setEditCommentKey('')}
                    onSubmit={(comment) => {
                      setEditCommentKey('');
                      props.onEditComment(key, comment);
                    }}
                  />
                )}

                {deleteCommentKey === key && (
                  <Modal
                    headerTitle={translate('issue.comment.delete')}
                    onClose={() => setDeleteCommentKey('')}
                    body={<p>{translate('issue.comment.delete_confirm_message')}</p>}
                    primaryButton={
                      <DangerButtonPrimary
                        onClick={() => {
                          setDeleteCommentKey('');
                          props.onDeleteComment(key);
                        }}
                      >
                        {translate('delete')}
                      </DangerButtonPrimary>
                    }
                    secondaryButtonLabel={translate('cancel')}
                  />
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

const CommentBox = styled(HtmlFormatter)`
  border-left: ${themeBorder('default', 'activityCommentPipe')};
`;
