import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import { useDispatch, connect } from 'react-redux';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { Grid, IconButton, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

import { useAccount, useDisconnect } from 'wagmi';
import { useRouter } from 'next/router';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import YupDialog from '../Miscellaneous/YupDialog';
import { YupButton, YupInput } from '../Miscellaneous';
import UserAvatar from '../UserAvatar/UserAvatar';
import {
  updateAccountInfo,
} from '../../redux/actions';
import {
  apiUploadProfileImage,
} from '../../apis';
import useToast from '../../hooks/useToast';
import useStyles from './styles';
import { useAuthModal } from '../../contexts/AuthModalContext';
import useYupAccount from '../../hooks/useAccount';
import withSuspense from '../../hoc/withSuspense';
import { useAuth } from '../../contexts/AuthContext';
// TODO: Refactor styling to Mui v5
function EditProfile({ open: modalOpen, onClose }) {
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { dialogOpen } = router.query;
  const { authInfo } = useAuth();
  const { account } = useYupAccount();

  const classes = useStyles();
  const dispatch = useDispatch();
  const { toastError } = useToast();
  const { linkEthAddress } = useAuthModal();
  // const { open: openAuthModal } = useAuthModal();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [avatar, setAvatar] = useState();
  const [fullName, setFullName] = useState();
  const [ethAddress, setEthAddress] = useState();
  const [bio, setBio] = useState();
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
    aspect: 1
  });
  const [pixelCrop, setPixelCrop] = useState({});
  const [cropTime, setCropTime] = useState(false);
  const [imageRef, setImageRef] = useState(null);
  const [connectModalIsOpen, setConnectModalIsOpen] = useState(false);

  const filePreview = files.length > 0 ? files[0].preview : '';
  const filename = files.length > 0 ? files[0].name : '';

  useEffect(() => {
    if (account) {
      setAvatar(account.avatar);
      setFullName(account.fullname);
      setBio(account.bio);
    }
    if (account?.ethInfo?.address !== ethAddress) {
      setEthAddress(account?.ethInfo?.address);
    }
  }, [account]);

  useEffect(() => {
    if (dialogOpen) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    setOpen(modalOpen);
  }, [modalOpen]);

  // Disconnect user if dialogOpen -> openConnectModal returns undefined if already connected
  useEffect(() => {
    if (isConnected && dialogOpen && !connectModalIsOpen) {
      disconnect();
    }
  }, [isConnected]);

  useEffect(() => {
    console.log({ account, ethAddress });
    if (
      account &&
      !account.ethInfo?.address &&
      openConnectModal &&
      dialogOpen &&
      !connectModalIsOpen &&
      !isConnected
    ) {
      handleOpenModalDynamicly();
      setConnectModalIsOpen(true);
    }
  }, [openConnectModal, isConnected, account]);

  const handleOpenModalDynamicly = () => {
    openConnectModal();
    handleLinkEthAddress();
  };

  const handleLinkEthAddress = async () => {
    linkEthAddress({ noRedirect: true });
  };

  const handleDialogClose = () => {
    files.forEach((file) => {
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    onClose();
    setFiles([]);
  };

  const saveImage = async () =>
    new Promise((resolve, reject) => {
      try {
        if (files.length === 0) {
          return;
        }
        const { file } = files[0];
        const reader = new window.FileReader();
        reader.onload = async () => {
          const body = {
            key: file.name,
            data: reader.result.split(',')[1],
            contentType: file.type
          };
          const { url } = await apiUploadProfileImage(body);
          resolve(url);
        };

        reader.readAsDataURL(file);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });

  const handleAccountInfoSubmit = async () => {
    try {
      if (account == null) {
        toastError('Download the Yup extension to edit your profile');
        return;
      }

      let newAvatar = avatar;

      if (cropTime) {
        toastError(`Crop your photo before saving!`);
        return;
      }

      if (files.length > 0) {
        newAvatar = await saveImage(); // Save avatar to ipfs and retrieve file hash
        if (newAvatar == null) {
          toastError('Failed to edit your profile. Try again later.');
          return;
        }
      }

      if (
        bio.trim() === account.bio &&
        fullName.trim() === account.fullname &&
        newAvatar.trim() === account.avatar
      ) {
        toastError('Must specify different bio, fullname, or avatar to update');
        return;
      }

      const update = {};
      if (bio) {
        update.bio = bio;
      }
      if (newAvatar) {
        update.avatar = newAvatar || account.avatar;
      }
      if (fullName) {
        update.fullname = fullName;
      }

      dispatch(updateAccountInfo(account, update, authInfo));
      handleDialogClose();
    } catch (err) {
      handleDialogClose();
      toastError('Failed to update account info. Try again later');
    }
  };

  const handleDrop = (files) => {
    try {
      if (files.length === 0) {
        // TODO: Add more specific error handling
        toastError('Photo is too large! Only files under 70 MB are accepted');
        return;
      }

      setFiles(
        files.map((file) => ({
          preview: URL.createObjectURL(file),
          file
        }))
      );
      setCropTime(!!files[0].type.includes('image'));
    } catch (err) {
      toastError('Failed to upload file. Try again later.');
    }
  };

  const handleCropChange = (crop, pixelCrop) => {
    setCrop({ ...crop });
    setPixelCrop({ ...pixelCrop });
  };

  const handleImageLoaded = (ref, pixelCrop) => {
    setImageRef(ref);
    setPixelCrop(pixelCrop);
  };

  const getCroppedImg = async (image, _pixelCrop, fileName) => {
    const canvas = document.createElement('canvas');
    canvas.width = _pixelCrop.width;
    canvas.height = _pixelCrop.height;
    const ctx = await canvas.getContext('2d');

    await ctx.drawImage(
      image,
      _pixelCrop.x,
      _pixelCrop.y,
      _pixelCrop.width,
      _pixelCrop.height,
      0,
      0,
      _pixelCrop.width,
      _pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      let bb = null;
      canvas.toBlob(async (blob) => {
        if (blob == null) {
          return;
        }
        blob.name = fileName;
        bb = blob;
        resolve(bb);
      }, 'image/jpeg');
    });
  };

  const cropComplete = async () => {
    const { file } = files[0];
    const img = await getCroppedImg(imageRef, pixelCrop, file.name);

    setFiles([
      {
        preview: URL.createObjectURL(img),
        file: img
      }
    ]);
    setCropTime(false);
  };

  function CropIcon() {
    if (!cropTime) {
      return null;
    }

    return (
      <Grid item>
        <IconButton onClick={cropComplete} size="large">
          <DoneIcon style={{ marginRight: '8px' }} />
          <Typography>Crop</Typography>
        </IconButton>
      </Grid>
    );
  }

  function RemovePhoto() {
    if (cropTime || files.length || avatar === '') {
      return null;
    }

    return (
      <YupButton className={classes.removePhoto} onClick={() => setAvatar('')}>
        Remove Current Photo
      </YupButton>
    );
  }

  return (
    <ErrorBoundary>
      <YupDialog
        headline="Edit Profile"
        buttonPosition="right"
        open={open}
        onClose={handleDialogClose}
        className={classes.dialog}
        aria-labelledby="form-dialog-title"
        firstButton={
          <YupButton
            onClick={handleAccountInfoSubmit}
            variant="contained"
            color="primary"
            size="medium"
          >
            Update
          </YupButton>
        }
        secondButton={
          <YupButton
            onClick={handleDialogClose}
            variant="outlined"
            color="primary"
            size="medium"
          >
            Cancel
          </YupButton>
        }
      >
        <Grid container direction="row" style={{ justifyContent: 'center' }}>
          <Grid item>
            {!cropTime ? (
              <div className={classes.dropzoneContainer}>
                <Dropzone
                  accept="image/*"
                  className={classes.dropzone}
                  maxSize={70000000}
                  onDrop={handleDrop}
                >
                  {files.length > 0 ? (
                    <UserAvatar
                      align="center"
                      alt="Preview"
                      className={classes.previewStyle}
                      height="auto"
                      key={filename}
                      src={filePreview}
                      width="100%"
                    />
                  ) : (
                    <UserAvatar
                      align="center"
                      alt="Add"
                      username={account?.username}
                      className={classes.dropzoneImg}
                      style={{ fontSize: '100px' }}
                      height="auto"
                      src={avatar}
                      width="100%"
                    />
                  )}
                </Dropzone>
              </div>
            ) : (
              <ReactCrop
                crop={crop}
                imageStyle={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  marginTop: 0,
                  maxWidth: '100%',
                  maxHeight: '400px'
                }}
                onChange={handleCropChange}
                onImageLoaded={handleImageLoaded}
                src={filePreview}
              />
            )}
            <CropIcon />
            <RemovePhoto />
          </Grid>
          <Grid item container direction="column" spacing={2}>
            <Grid item>
              <YupInput
                defaultValue={fullName}
                fullWidth
                id="name"
                maxLength={17}
                label="Name"
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <YupInput
                defaultValue={bio}
                fullWidth
                id="bio"
                maxLength={140}
                label="Bio"
                multiline
                rows={2}
                onChange={(e) => setBio(e.target.value)}
                type="text"
                variant="outlined"
              />
            </Grid>
            {ethAddress ? (
              <Grid item>
                <YupInput
                  autoFocus
                  defaultValue={ethAddress}
                  fullWidth
                  disabled
                  id="name"
                  maxLength={250}
                  label="ETH Address"
                  multiline
                  type="text"
                  variant="outlined"
                />
              </Grid>
            ) : (
              <Grid item>
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <YupButton
                      fullWidth
                      onClick={() => {
                        openConnectModal();
                        handleLinkEthAddress();
                      }}
                      variant="outlined"
                      color="secondary"
                    >
                      {!ethAddress ? 'Connect Eth' : 'Change Eth'}
                    </YupButton>
                  )}
                </ConnectButton.Custom>
              </Grid>
            )}
          </Grid>
        </Grid>
      </YupDialog>
    </ErrorBoundary>
  );
}

// TODO: Move to `useSelector`

export default withSuspense()(EditProfile);
