import { Menu, MenuItem, Typography } from '@mui/material';
import { faShare, faCopy, faBars } from '@fortawesome/pro-solid-svg-icons';
import React, { useState } from 'react';
import { FlexBox, YupContainer } from '../styles';
import { HeaderRoot, Logo } from './styles';
import { DEFAULT_IMAGE_PATH } from '../../utils/helpers';
import YupLink from '../YupLink';
import ActionIcon from '../ActionIcon';
import useToast from '../../hooks/useToast';
import {
  CollectionDuplicateDialog,
  CollectionEditDialog
} from '../Collections';
import { useAuth } from '../../contexts/AuthContext';

// TODO: Implement Tour
function CollectionHeader({ collection, minimized }) {
  const { toastSuccess } = useToast();
  const account = useAuth();
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const { isLoggedIn, userId } = account;

  const handleShare = async () => {
    // eslint-disable-next-line no-restricted-globals
    await navigator.clipboard.writeText(location.href);
    toastSuccess('Copied collection to clipboard');
  };

  const { name, owner, ownerId, images } = collection;
  const isMyCollection = userId === ownerId;

  return (
    <YupContainer sx={{ pb: 3 }}>
      <HeaderRoot>
        <Logo
          src={[...(images || []), DEFAULT_IMAGE_PATH]}
          alt={name}
          size={minimized ? 'small' : 'large'}
        />
        <FlexBox flexGrow={1} flexDirection="column">
          <Typography variant="h3">{name}</Typography>
          {!minimized && (
            <Typography variant="subtitle1">
              Curated by&nbsp;
              <YupLink href={`/account/${ownerId}`}>{owner}</YupLink>
            </Typography>
          )}
        </FlexBox>
        <FlexBox columnGap={1}>
          <ActionIcon icon={faShare} onClick={handleShare} />
          {isLoggedIn && !isMyCollection && (
            <ActionIcon
              icon={faCopy}
              onClick={() => setDuplicateModalOpen(true)}
            />
          )}
          {isMyCollection && (
            <ActionIcon
              icon={faBars}
              onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}
            />
          )}
        </FlexBox>
      </HeaderRoot>

      {/* Menu */}
      <Menu
        id="collection-edit-menu"
        open={Boolean(menuAnchorEl)}
        anchorEl={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchorEl(null);
            setEditModalOpen(true);
          }}
        >
          Edit
        </MenuItem>
      </Menu>

      {/* Modal Definition */}

      <CollectionDuplicateDialog
        collection={collection}
        account={account}
        dialogOpen={duplicateModalOpen}
        handleDialogClose={() => setDuplicateModalOpen(false)}
      />

      <CollectionEditDialog
        collection={collection}
        account={account}
        dialogOpen={editModalOpen}
        handleDialogClose={() => setEditModalOpen(false)}
      />
    </YupContainer>
  );
}

export default CollectionHeader;
