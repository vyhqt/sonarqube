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
import {
  CoverageIndicator,
  DiscreetInteractiveIcon,
  Dropdown,
  FilterIcon,
  HelperHintIcon,
  ItemCheckbox,
  ItemDangerButton,
  ItemDivider,
  ItemHeader,
  PopupZLevel,
} from 'design-system';
import * as React from 'react';
import withComponentContext from '../../../app/components/componentContext/withComponentContext';
import withCurrentUserContext from '../../../app/components/current-user/withCurrentUserContext';
import HelpTooltip from '../../../components/controls/HelpTooltip';
import Tooltip from '../../../components/controls/Tooltip';
import Measure from '../../../components/measure/Measure';
import Spinner from '../../../components/ui/Spinner';
import { PopupPlacement } from '../../../components/ui/popups';
import { isBranch } from '../../../helpers/branch-like';
import { translate } from '../../../helpers/l10n';
import { BranchLike } from '../../../types/branch-like';
import { ComponentContextShape } from '../../../types/component';
import { MetricKey, MetricType } from '../../../types/metrics';
import { HotspotFilters } from '../../../types/security-hotspots';
import { CurrentUser, isLoggedIn } from '../../../types/users';
import { HotspotDisabledFilterTooltip } from './HotspotDisabledFilterTooltip';

export interface SecurityHotspotsAppRendererProps extends ComponentContextShape {
  branchLike?: BranchLike;
  currentUser: CurrentUser;
  filters: HotspotFilters;
  hotspotsReviewedMeasure?: string;
  isStaticListOfHotspots: boolean;
  loadingMeasure: boolean;
  onChangeFilters: (filters: Partial<HotspotFilters>) => void;
}

function HotspotSidebarHeader(props: SecurityHotspotsAppRendererProps) {
  const {
    branchLike,
    component,
    currentUser,
    filters,
    hotspotsReviewedMeasure,
    isStaticListOfHotspots,
    loadingMeasure,
  } = props;

  const userLoggedIn = isLoggedIn(currentUser);

  const filtersCount =
    Number(filters.assignedToMe) + Number(isBranch(branchLike) && filters.inNewCodePeriod);

  const isFiltered = Boolean(filtersCount);

  return (
    <div className="sw-flex sw-h-6 sw-items-center sw-px-4 sw-py-4">
      <Spinner loading={loadingMeasure}>
        {hotspotsReviewedMeasure !== undefined && (
          <CoverageIndicator value={hotspotsReviewedMeasure} />
        )}

        <Measure
          className="it__hs-review-percentage sw-body-sm-highlight sw-ml-2"
          metricKey={
            isBranch(branchLike) && !filters.inNewCodePeriod
              ? MetricKey.security_hotspots_reviewed
              : MetricKey.new_security_hotspots_reviewed
          }
          metricType={MetricType.Percent}
          value={hotspotsReviewedMeasure}
        />
      </Spinner>

      <span className="sw-body-sm sw-ml-1">
        {translate('metric.security_hotspots_reviewed.name')}
      </span>

      <HelpTooltip className="sw-ml-1" overlay={translate('hotspots.reviewed.tooltip')}>
        <HelperHintIcon aria-label="help-tooltip" />
      </HelpTooltip>

      {!isStaticListOfHotspots && (isBranch(branchLike) || userLoggedIn || isFiltered) && (
        <div className="sw-flex sw-flex-grow sw-justify-end">
          <Dropdown
            allowResizing
            closeOnClick={false}
            id="filter-hotspots-menu"
            zLevel={PopupZLevel.Global}
            overlay={
              <>
                <ItemHeader>{translate('hotspot.filters.title')}</ItemHeader>

                {isBranch(branchLike) && (
                  <ItemCheckbox
                    checked={Boolean(filters.inNewCodePeriod)}
                    onCheck={(inNewCodePeriod: boolean) =>
                      props.onChangeFilters({ inNewCodePeriod })
                    }
                  >
                    <span className="sw-mx-2">
                      {translate('hotspot.filters.period.since_leak_period')}
                    </span>
                  </ItemCheckbox>
                )}

                {userLoggedIn && (
                  <Tooltip
                    classNameSpace={component?.needIssueSync ? 'tooltip' : 'sw-hidden'}
                    overlay={<HotspotDisabledFilterTooltip />}
                    placement="right"
                  >
                    <ItemCheckbox
                      checked={Boolean(filters.assignedToMe)}
                      disabled={component?.needIssueSync}
                      onCheck={(assignedToMe: boolean) => props.onChangeFilters({ assignedToMe })}
                    >
                      <span className="sw-mx-2">
                        {translate('hotspot.filters.assignee.assigned_to_me')}
                      </span>
                    </ItemCheckbox>
                  </Tooltip>
                )}

                {isFiltered && <ItemDivider />}

                {isFiltered && (
                  <ItemDangerButton
                    onClick={() =>
                      props.onChangeFilters({
                        assignedToMe: false,
                        inNewCodePeriod: false,
                      })
                    }
                  >
                    {translate('hotspot.filters.clear')}
                  </ItemDangerButton>
                )}
              </>
            }
            placement={PopupPlacement.BottomRight}
          >
            <DiscreetInteractiveIcon
              Icon={FilterIcon}
              aria-label={translate('hotspot.filters.title')}
            >
              {isFiltered ? filtersCount : null}
            </DiscreetInteractiveIcon>
          </Dropdown>
        </div>
      )}
    </div>
  );
}

export default withComponentContext(withCurrentUserContext(HotspotSidebarHeader));
