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
import * as React from 'react';
import { WebApi } from '../../../types/types';

interface Props {
  changelog: WebApi.Changelog[];
}

export default function ActionChangelog({ changelog }: Props) {
  return (
    <ul className="big-spacer-top">
      {changelog.map((item, index) => (
        <li className="spacer-top" key={index}>
          <span className="spacer-right badge">{item.version}</span>
          {item.description}
        </li>
      ))}
    </ul>
  );
}
