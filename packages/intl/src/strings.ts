/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2023 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { plural, select, t } from "@lingui/core/macro";
import { actionConfirmations } from "../generated/action-confirmations";
import { actionErrors } from "../generated/action-errors";
import { actions } from "../generated/actions";
import { doActions } from "../generated/do-actions";
import { inProgressActions } from "../generated/in-progress-actions";

const SEARCH_IN_ROUTE_STRINGS = {
  Notes: () => t`Search in Notes`,
  Notebooks: () => t`Search in Notebooks`,
  Notebook: () => t`Search in Notebook`,
  Favorites: () => t`Search in Favorites`,
  Reminders: () => t`Search in Reminders`,
  Trash: () => t`Search in Trash`,
  Settings: () => t`Search in Settings`,
  Tags: () => t`Search in Tags`,
  Editor: () => t`Search in Editor`,
  Home: () => t`Search in Home`,
  Search: () => t`Search in Search`,
};

const TRANSACTION_STATUS = {
  completed: () => t`Completed`,
  refunded: () => t`"Refunded`,
  partially_refunded: () => t`Partially refunded`,
  disputed: () => t`Disputed`
};

const REMINDER_NOTIFICATION_MODES = {
  Silent: () => t`Silent`,
  Vibrate: () => t`Vibrate`,
  Urgent: () => t`Urgent`
};

export const strings = {
  done: () => t`Done`,
  verifyItsYou: () => t`Please verify it's you`,
  unlockNotes: () => t`Unlock your notes`,
  note: () => t`Note`,
  notes: (count: number) =>
    plural(count, {
      one: `# note`,
      other: `# notes`
    }),
  downloading: () => t`Downloading`,
  uploading: () => t`Uploading`,
  networkProgress: (type: "upload" | "download" | "sync") =>
    select(type, {
      upload: "Uploading",
      download: "Downloading",
      sync: "Syncing",
      other: "Loading"
    }),
  tapToCancel: () => t`Tap to cancel`,
  attachmentsDownloadFailed: (count: number) =>
    plural(count, {
      one: "Failed to download attachment",
      other: "Failed to download # attachments"
    }),
  attachmentsDownloaded: (count: number, total: number, path: string) =>
    plural(count, {
      one: `Attachment downloaded at ${path}`,
      other: `#/${total} attachments downloaded as a zip file at ${path}`
    }),
  downloadAllAttachmentsConfirmation: (count: number) =>
    plural(count, {
      one: "Are you sure you want to download all attachments of this note?",
      other: "Are you sure you want to download all attachments?"
    }),
  noDownloads: () => t`No downloads in progress.`,
  noAttachments: () => t`No attachments.`,
  attachmentsEncryptedNote: () => t`All attachments are end-to-end encrypted.`,
  signupAgreement: {
    0: () => t`By signing up, you agree to our `,
    1: () => t`Terms of Service `,
    2: () => t`and `,
    3: () => t`Privacy Policy. `,
    4: () =>
      t`You also agree to receive marketing emails from us which you can opt-out of from app settings.`
  },
  "2faCodeHelpText": {
    email: () =>
      t`Enter the 6 digit code sent to your email to continue logging in`,
    sms: () =>
      t`Enter the 6 digit code sent to your phone number to continue logging in`,
    app: () =>
      t`Enter the 6 digit code from your authenticator app to continue logging in`,
    recoveryCode: () => t`Enter the recovery code to continue logging in`
  },
  "2faCodeSecondaryMethodText": {
    email: () => t`I don't have access to email`,
    sms: () => t`I don't have access to my phone`,
    app: () => t`I don't have access to authenticator app`,
    recoveryCode: () => t`I don't have recovery codes`
  },
  attachImageHeading: (count: number) =>
    plural(count, {
      one: "Attach image",
      other: "Attach # images"
    }),
  compress: () => t`Compress`,
  recommended: () => t`Recommended`,
  compressionOffNotice: () =>
    t`Images uploaded without compression are slow to load and take more bandwidth. We recommend compressing images unless you need image in original quality.`,
  compressionOnNotice: () =>
    t`Compressed images are uploaded in Full HD resolution and usually are good enough for most use cases.`,
  loadingWithProgress: (progress: string) =>
    t`Loading ${progress ? `(${progress})` : ""}, please wait...`,
  vaultEnableBiometrics: () =>
    t` Unlock with password once to enable biometric access.`,
  deleteVault: () => t`Delete vault`,
  clearVault: () => t`Clear vault`,
  enable: () => t`Enable`,
  revoke: () => t`Revoke`,
  change: () => t`Change`,
  delete: () => t`Delete`,
  share: () => t`Share`,
  open: () => t`Open`,
  unlock: () => t`Unlock`,
  create: () => t`Create`,
  lock: () => t`Lock`,
  deletedOn: (date: string) => t`Deleted on ${date}`,
  disabled: () => t`Disabled`,
  reminderRecurringMode: {
    day: () => t`Daily`,
    week: () => t`Weekly`,
    month: () => t`Monthly`,
    year: () => t`Yearly`
  },
  mergeConflict: {
    thisDevice: () => t`This device`,
    otherDevice: () => t`Incoming`
  },
  noteHistoryPlaceholder: () => t`No note history available for this device.`,
  noteHistoryNotice: () => t`Note version history is local only.`,
  encryptedNoteHistoryNotice: () =>
    t`Preview not available, content is encrypted.`,
  dateDescFromKey: (
    key:
      | "dateCreated"
      | "dateEdited"
      | "dateModified"
      | "dateUploaded"
      | "dateDeleted"
  ) =>
    select(key, {
      dateCreated: `Created at`,
      dateEdited: `Last edited at`,
      dateModified: `Last modified at`,
      dateUploaded: `Uploaded at`,
      dateDeleted: `Deleted at`,
      other: key
    }),
  noNotePropertiesNotice: () => t`Start writing to save your note.`,
  emptyPlaceholders: (type: "notebook" | "tag" | "note") =>
    select(type, {
      other: "This list is empty",
      notebook: "No notebooks",
      tag: "No tags",
      note: "No notes"
    }),
  untitledNote: () => t`Untitled`,
  newNote: () => t`New note`,
  exportingNotes: (status?: string) =>
    t`${status ? status : "Exporting notes"}`,
  exportingNotesDesc: () => t`Please wait while we export your notes.`,
  exportingNote: (title: string) => t`Exporting "${title}"`,
  exportingNoteDesc: () => t`Please wait while we export your not.`,
  exportSuccessHeading: (count: number) =>
    plural(count, {
      one: "Note exported",
      other: "# notes exported"
    }),
  exportSuccessDesc: (path: string) =>
    t`Notes exported as ${path} successfully`,
  issueCreatedHeading: () => t`Issue created`,
  issueCreatedDesc: {
    0: () => t`You can track your issue at `,
    1: () =>
      t`Please note that we will respond to your issue on the given link. We recommend that you save it.`
  },
  linkNoteEmptyBlock: () => t`(empty block)`,
  linkNoteSelectedNote: () => t`SELECTED NOTE`,
  tapToDeselect: () => t`Tap to deselect`,
  clickToDeselect: () => t`Click to deselect`,
  linkNoteToSection: () => t`LINK TO A SECTION`,
  migrationProgress: (progress?: {
    total: number;
    collection: string;
    current: number;
  }) =>
    t`Migrating ${progress ? `${progress?.collection}` : ""} ${
      progress ? `(${progress.current}/${progress.total}) ` : ""
    }... please wait`,
  migrationError: () =>
    t`An error occurred while migrating your data. You can logout of your account and try to relogin. However this is not recommended as it may result in some data loss if your data was not synced.`,
  migrationAppReset: () =>
    t`App data has been cleared. Kindly relaunch the app to login again.`,
  migrationErrorNotice: () => [
    t`If this continues to happen, please reach out to us via`,
    t`or email us at`
  ],
  migrationFailed: () => t`Migration failed`,
  notebooks: () => t`Notebooks`,
  downloadingAttachments: () => t`Downloading attachments`,
  pleaseWait: () => t`Please wait`,
  openInBrowser: () => t`Open in browser`,
  noBlocksLinked: () => t`No blocks linked`,
  noReferencesFound: () => t`No references found of this note`,
  notReferenced: () => t`This note is not referenced in other notes.`,
  notLinked: () => t`This note is not linked to any other note.`,
  noLinksFound: () => t`No links found`,
  noBlocksOnNote: () => t`There are no blocks in this note.`,
  dataTypes: {
    note: () => t`note`,
    notebook: () => t`notebook`,
    tag: () => t`tag`,
    reminder: () => t`reminder`,
    color: () => t`color`,
    attachment: () => t`attachment`,
    item: () => t`item`,
    shortcut: () => t`shortcut`
  },
  dataTypesCamelCase: {
    note: () => t`Note`,
    notebook: () => t`Notebook`,
    tag: () => t`Tag`,
    reminder: () => t`Reminder`,
    color: () => t`Color`,
    attachment: () => t`Attachment`,
    item: () => t`Item`,
    shortcut: () => t`Shortcut`
  },
  dataTypesPlural: {
    note: () => t`notes`,
    notebook: () => t`notebooks`,
    tag: () => t`tags`,
    reminder: () => t`reminders`,
    color: () => t`colors`,
    attachment: () => t`attachments`,
    item: () => t`items`,
    shortcut: () => t`shortcuts`
  },
  dataTypesPluralCamelCase: {
    note: () => t`Notes`,
    notebook: () => t`Notebooks`,
    tag: () => t`Tags`,
    reminder: () => t`Reminders`,
    color: () => t`Colors`,
    attachment: () => t`Attachments`,
    favorite: () => t`Favorites`,
    item: () => t`Items`,
    shortcut: () => t`Shortcuts`
  },
  addItem: (itemType: "tag" | "notebook" | "reminder" | "note") =>
    select(itemType, {
      tag: `Add a tag`,
      notebook: `Add a notebook`,
      reminder: `Add a reminder`,
      note: `Add a note`,
      other: `Add an item`
    }),
  reminderRepeatStrings: {
    day: (date: string) => t`Repeats daily at ${date}`,
    week: {
      daily: (date: string) => t`The reminder will repeat daily at ${date}.`,
      selectDays: () => t`Select day of the week to repeat the reminder.`
    },
    year: (date: string) => t`The reminder will repeat every year on ${date}.`,
    month: {
      selectDays: () => t`Select nth day of the month to repeat the reminder.`
    },
    repeats: (
      freq: number,
      mode: string,
      selectedDays: string,
      date: string
    ) => {
      const strings = {
        day: plural(freq, {
          one: `Repeats every day on ${selectedDays} at ${date}`,
          other: `Repeats every # day every ${selectedDays} at ${date}`
        }),
        week: plural(freq, {
          one: `Repeats every week on ${selectedDays} at ${date}`,
          other: `Repeats every # week every ${selectedDays} at ${date}`
        }),
        month: plural(freq, {
          one: `Repeats every month on ${selectedDays} at ${date}`,
          other: `Repeats every # month every ${selectedDays} at ${date}`
        }),
        year: plural(freq, {
          one: `Repeats every year on ${selectedDays} at ${date}`,
          other: `Repeats every # year every ${selectedDays} at ${date}`
        })
      };
      return strings[mode as keyof typeof strings];
    }
  },
  remindMeIn: () => t`Remind me in`,
  referencedIn: () => t`Referenced in`,
  restoreSelectFolder: () =>
    t`Select the folder that includes your backup files to list them here.`,
  noBackupsFound: () => t`No backups found`,
  restoring: () => t`Restoring`,
  restoringCollection: (collection: string) => t`Restoring ${collection}...`,
  checkNewVersion: () => t`Checking for new version`,
  noUpdates: () => t`No updates available`,
  updateAvailable: () => t`Update available`,
  versionReleased: (version: string, type: "github" | "store") =>
    select(type, {
      github: `v${version} has been released on GitHub`,
      other: `v${version} has been released`
    }),
  readReleaseNotes: () => t`Read full release notes on Github`,
  settings: () => t`Settings`,
  notLoggedIn: () => t`Not logged in`,
  loggedInAs: (email: string) => t`Logged in as ${email}`,
  never: () => t`Never`,
  editorFailedToLoad: () =>
    t`If the editor fails to load even after reloading. Try restarting the app.`,
  gettingInformation: () => t`Getting information`,
  protectNotes: () => t`Protect your notes`,
  protectNotesDesc: () => t`Choose how you want to secure your notes locally.`,
  loggingOut: () => t`Logging out. Please wait...`,
  loggingOutDesc: () => t`Please wait while we log you out.`,
  by: () => t`By`,
  noResultsForSearch: (query: string) => t`No results found for "${query}"`,
  results: (count: number) =>
    plural(count, {
      one: "1 result",
      other: `# results`
    }),
  noThemesFound: () => t`No themes found`,
  errorLoadingThemes: () => t`Error loading themes`,
  loadingThemes: () => t`Loading themes...`,
  version: () => t`Version`,
  visitHomePage: () => t`Visit homepage`,
  tapToApplyAgain: () => t`Tap to apply again`,
  titleFormattingGuide: () => t`Use the following key to format the title:

$date$: Current date.
$time$: Current time.
$timestamp$: Full date and time without any spaces or other symbols.
(e.g 202305261253).
$count$: Number of notes + 1.
$headline$: Use starting line of the note as title.
$day$: Current day (eg. Monday)`,
  setYourName: () => t`Set your name`,
  presets: () => t`PRESETS`,
  group: () => t`GROUP`,
  groupedAllTools: () => t`All tools are grouped`,
  collapsed: () => t`COLLAPSED`,
  releaseNotes: () => t`Release notes`,
  passTooShort: () => t`Atleast 8 characters required`,
  changePassword: () => t`Change password`,
  changeAppLockCredentials: (
    mode: "create" | "change" | "remove",
    keyboardType: string
  ) =>
    select(mode, {
      create: `Create app lock ${keyboardType}`,
      change: `Change app lock ${keyboardType}`,
      remove: `Remove app lock ${keyboardType}`,
      other: ""
    }),

  createVault: () => t`Create vault`,
  createVaultDesc: () => t`A vault stores your notes in an encrypted storage.`,
  vaultFingerprintUnlock: () => t`Vault fingerprint unlock`,
  revokeVaultFingerprintUnlock: () => t`Revoke vault fingerprint unlock`,
  changeVaultPassword: () => t`Change vault password`,
  deleteNote: () => doActions.delete.note(1),
  shareNote: () => t`Share note`,
  copyNote: () => t`Copy note`,
  goToEditor: () => t`Unlock note`,
  lockNote: () => t`Lock note`,
  applyChanges: () => t`Apply changes`,
  noteHistory: () => t`Note history`,
  selectNotebooks: () => t`Select notebooks`,
  selectNotebooksDesc: () => t`Select notebooks you want to add note(s) to.`,
  selectNotebooksDesktopDesc: (keyboardShortcut: string) =>
    t`Use ${keyboardShortcut}+click to select multiple notebooks`,
  enableMultiSelect: () =>
    t`You can also link a note to multiple Notebooks. Tap and hold any notebook to enable multi-select.`,
  export: () => t`Export`,
  exportNotes: (notes: number) =>
    plural(notes, { one: "Export note", other: "Export # notes" }),
  issueTitle: () => t`Report issue`,
  issueDesc: () =>
    t`We are sorry, it seems that the app crashed due to an error. You can submit a bug report below so we can fix this asap.`,
  issueDesc2: () =>
    t`Let us know if you have faced any issue/bug while using Sunshine Notes. We will try to fix it as soon as possible.`,
  issueReportCopied: () => t`The report was copied to your clipboard.`,
  issueLocalNotice: () =>
    t`The report never leaves this device. It is copied to your clipboard so you can share it wherever you want.`,
  migrationSaveBackup: () => t`Save a backup of your notes`,
  migrationSaveBackupDesc: () =>
    t`Thank you for updating Sunshine Notes! We will be applying some minor changes for a better note taking experience.`,
  moveNotebook: (count: number, title: string) =>
    plural(count, {
      one: `Moving ${title}`,
      other: `Moving # notebooks`
    }),
  addNotesToNotebook: (title: string) => t`Add notes to ${title}`,
  publish: () => t`Publish`,
  backups: () => t`Backups`,
  fallbackMethodEnabled: () => t`Fallback method for 2FA enabled`,
  listOf: () => t`List of`,
  network: {
    downloading: (progress?: string | number) =>
      progress ? t`Downloading (${progress})` : t`Downloading`,
    downloaded: () => t`Downloaded`,
    download: () => t`Download`,
    upload: () => t`Upload`,
    uploaded: () => t`Uploaded`,
    uploading: () => t`Uploading`,
    reupload: () => t`Reupload`,
    downloadSuccess: () => t`Download successful`,
    fileDownloaded: (name?: string) => t`${name || "File"} downloaded`,
    dowloadCancelled: () => t`Download cancelled`,
    cancelDownload: () => t`Cancel download`,
    cancelUpload: () => t`Cancel upload`
  },
  regenerate: () => t`Regenerate`,
  redo: () => t`Redo`,
  pinned: () => t`Pinned`,
  editNotebook: () => doActions.edit.notebook(1),
  newNotebook: () => t`New notebook`,
  newInternalLink: () => t`Link to note`,
  editInternalLink: () => t`Edit internal link`,
  newColor: () => t`New color`,
  tabs: () => t`Tabs`,
  add: () => t`Add`,
  newVersion: () => t`New version`,
  newVersionHighlights: (version?: string) =>
    t`${version ? `v${version} ` : "New version"} Highlights 🎉`,
  editReminder: () => doActions.edit.reminder(1),
  newReminder: () => t`New reminder`,
  sortBy: () => t`Sort by`,
  groupBy: () => t`Group by`,
  toc: () => t`Table of contents`,
  appliedDark: () => t`Applied as dark theme`,
  appliedLight: () => t`Applied as light theme`,
  basic: () => t`Basic`,
  continue: () => t`Continue`,
  unlockWithBiometrics: () => t`Unlock with biometrics`,
  fileCheck: () => t`Run file check`,
  rename: () => t`Rename`,
  no: () => t`No`,
  yes: () => t`Yes`,
  cancel: () => t`Cancel`,
  skip: () => t`Skip`,
  next: () => t`Next`,
  addColor: () => t`Add color`,
  unlockNote: () => t`Unlock note`,
  couldNotUnlock: () => t`Could not unlock`,
  unlockNoteDesc: () =>
    t`Your note will be unencrypted and removed from the vault.`,
  deleteAllNotes: () => t`Delete notes in this vault permanently`,
  getStarted: () => t`Get started`,
  saveACopy: () => t`Save a copy`,
  discard: () => t`Discard`,
  undo: () => t`Undo`,
  keep: () => t`Keep`,
  restore: () => t`Restore`,
  deletePermanently: () => t`Delete permanently`,
  viewAllLinkedNotebooks: () => t`View all linked notebooks`,
  addTag: () => t`Add tag`,
  addTagDesc: () => t`Create a tag to group related notes together.`,
  save: () => t`Save`,
  verify: () => t`Verify`,
  newTab: () => t`New tab`,
  openFileLocation: () => t`Open file location`,
  exportAgain: () => t`Export again`,
  openIssue: () => t`Open issue`,
  submit: () => t`Submit`,
  createLink: () => t`Create link`,
  logoutAndClearData: () => t`Logout and clear data`,
  saveAndContinue: () => t`Save and continue`,
  moveToTop: () => t`Move to top`,
  moveSelectedNotes: () => t`Move selected notes`,
  gotIt: () => t`Got it`,
  update: () => t`Update`,
  copyToClipboard: () => t`Copy to clipboard`,
  saveAsText: () => t`Save to text file`,
  shareToCloud: () => t`Share to cloud`,
  linkedNotes: () => t`Linked notes`,
  noLinkedNotes: () => t`No linked notes`,
  reminderModes: (mode: string) =>
    select(mode, {
      repeat: "Repeat",
      once: "Once",
      permanent: "Permanent",
      other: "Unknown mode"
    }),
  recurringModes: (mode: string) =>
    select(mode, {
      day: "Daily",
      week: "Weekly",
      month: "Monthly",
      year: "Yearly",
      other: "Unknown mode"
    }),
  weekDayNames: {
    0: () => t`Sunday`,
    1: () => t`Monday`,
    2: () => t`Tuesday`,
    3: () => t`Wednesday`,
    4: () => t`Thursday`,
    5: () => t`Friday`,
    6: () => t`Saturday`
  },
  weekDayNamesShort: {
    0: () => t`Sun`,
    1: () => t`Mon`,
    2: () => t`Tue`,
    3: () => t`Wed`,
    4: () => t`Thu`,
    5: () => t`Fri`,
    6: () => t`Sat`
  },
  selectDate: () => t`Select date`,
  reminderNotificationModes: (
    mode: keyof typeof REMINDER_NOTIFICATION_MODES | ({} & string)
  ) => {
    return mode in REMINDER_NOTIFICATION_MODES
      ? REMINDER_NOTIFICATION_MODES[
          mode as keyof typeof REMINDER_NOTIFICATION_MODES
        ]()
      : mode;
  },
  selectBackupsFolder: () => t`Select backups folder`,
  oldNew: () => t`Old - new`,
  newOld: () => t`New - old`,
  latestFirst: () => t`Latest first`,
  earliestFirst: () => t`Earliest first`,
  mostRelevantFirst: () => t`Most relevant first`,
  leastRelevantFirst: () => t`Least relevant first`,
  aToZ: () => t`A to Z`,
  zToA: () => t`Z to A`,
  title: () => t`Title`,
  sortByStrings: {
    dateModified: () => t`Date modified`,
    dateEdited: () => t`Date edited`,
    dateCreated: () => t`Date created`,
    title: () => t`Title`,
    dueDate: () => t`Due date`,
    dateDeleted: () => t`Date deleted`,
    relevance: () => t`Relevance`
  },
  groupByStrings: {
    default: () => t`Default`,
    none: () => t`None`,
    abc: () => t`Abc`,
    year: () => t`Year`,
    week: () => t`Week`,
    month: () => t`Month`
  },
  downloadUpdate: () => t`Download update`,
  stopReordering: () => t`Tap to stop reordering`,
  removeShortcut: () => doActions.remove.shortcut(1),
  createShortcut: () => t`Create a shortcut`,
  tip: () => t`TIP`,
  neverShowAgain: () => t`Never show again`,
  reloadEditor: () => t`Taking too long? Reload editor`,
  copy: () => t`Copy`,
  copyCodes: () => t`Copy codes`,
  saveToFile: () => t`Save to file`,
  manageSubDesktop: () => t`Manage subscription on desktop`,
  resubFromPlaystore: () => t`Resubscribe from Playstore`,
  resubToPro: () => t`Resubscribe to Pro`,
  getPro: () => t`Get Pro`,
  monthShort: () => t`mo`,
  yearShort: () => t`yr`,
  dark: () => t`Dark`,
  light: () => t`Light`,
  all: () => t`All`,
  loadFromFile: () => t`Load from file`,
  setAsDarkTheme: () => t`Set as dark theme`,
  setAsLightTheme: () => t`Set as light theme`,
  createAGroup: () => t`Create a group`,
  fileCheckFailed: (reason: string) =>
    t`File check failed: ${reason} Try reuploading the file to fix the issue.`,
  sideMenuNotice: () => t`Add shortcuts for notebooks and tags here.`,
  debugNotice: () =>
    t`All logs are local only and are not sent to any server. You can share the logs from here with us if you face an issue to help us find the root cause.`,
  configureToolbarNotice: () =>
    t`Curate the toolbar that fits your needs and matches your personality.`,
  fileSaved: (name: string, platform: string) =>
    select(platform, {
      android: `${name} saved to selected path`,
      other: `${name} saved to File Manager/Sunshine Notes/downloads`
    }),
  downloadError: (message: string) => t`Error downloading file: ${message}`,
  invalid: (type: string) => t`Invalid ${type}`,
  fileCheckPassed: () => t`File check passed`,
  renameFile: () => t`Rename file`,
  hashCopied: () => t`Hash copied`,
  mediaTypes: {
    all: () => t`All files`,
    image: () => t`Images`,
    video: () => t`Videos`,
    document: () => t`Documents`,
    orphaned: () => t`Orphaned`,
    errors: () => t`Errors`,
    audio: () => t`Audios`
  },
  orphaned: () => t`Orphaned`,
  uploads: () => t`Uploads`,
  allFieldsRequired: () => t`All fields are required`,
  allFieldsRequiredDesc: () => t`Please fill all the fields to continue.`,
  backupFailed: () => t`Could not create backup`,
  applockDisabled: () => t`App lock disabled`,
  remove: () => t`Remove`,
  passwordIncorrect: () => t`Password incorrect`,
  incorrect: (type: string) => t`Incorrect ${type}`,
  mismatch: (type: string) => t`${type} does not match`,
  noColorSelected: () => t`No color selected`,
  colorExists: (color: string) => t`Color #${color} already exists`,
  pdfLocked: () => t`PDF is password protected`,
  pdfLockedDesc: () =>
    t`Please enter the password to unlock the PDF and view the content.`,
  enterPassword: () => t`Enter password`,
  failedToDownloadFile: () => t`Failed to download file`,
  zipping: () => t`Zipping`,
  savingZipFile: (progress?: string) =>
    progress
      ? t`Saving zip file (${progress}%). Please wait...`
      : t`Saving zip file. Please wait...`,
  failedToZipFiles: () => t`Failed to zip files`,
  fileVerificationFailed: () => t`Uploaded file verification failed.`,
  fileLengthError: () =>
    t`File length is 0. Please upload this file again from the attachment manager.`,
  fileLengthMismatch: (expectedSize: number, currentSize: number) =>
    t`File length mismatch. Expected ${expectedSize} but got ${currentSize} bytes. Please upload this file again from the attachment manager.`,
  failedToResolvedDownloadUrl: () => t`Failed to resolve download url`,
  fileSize: () => `File size`,
  donwloadStarted: () => t`Download started... Please wait`,
  passwordNotEntered: () => t`Password not entered`,
  passwordNotMatched: () => t`Password does not match`,
  passwordUpdated: () => t`Password updated`,
  noteLocked: () => t`Note locked`,
  biometricUnlockEnabled: () => t`Biometric unlocking enabled`,
  biometricUnlockDisabled: () => t`Biometric unlocking disabled`,
  vaultCreated: () => t`Vault created`,
  noteUnlocked: () => t`Note unlocked`,
  noteCopied: () => t`Note copied to clipboard`,
  shortcutCreated: () => actions.created.shortcut(1),
  notebookRestored: () => actions.restored.notebook(1),
  restoreNotebook: () => doActions.restore.notebook(1),
  permanentlyDeletedNotebook: () => actions.permanentlyDeleted.notebook(1),
  noteRestoredFromHistory: () => t`Note restored from history`,
  noteRestored: () => actions.restored.note(1),
  deleteNoteConfirmation: () => actionConfirmations.permanentlyDelete.note(1),
  noteDeleted: () => actions.deleted.note(1),
  restored: () => t`Restored successfully`,
  manageTags: () => t`Manage tags`,
  linkNotebook: () => t`Link to notebook`,
  move: () => t`Move`,
  unlinkNotebook: () => t`Unlink notebook`,
  unfavorite: () => t`Unfavorite`,
  moveToTrash: () => t`Move to trash`,
  enterNotebookTitle: () => t`Enter notebook title`,
  noApplicationFound: (fileToOpen: string) =>
    t`No application found to open ${fileToOpen}`,
  moveNotebooks: (count: number) =>
    plural(count, { one: "Move notebook", other: `Move # notebooks` }),
  moveNotebooksConfirm: (count: number, selectedNotebookTitle: string) =>
    plural(count, {
      one: `Are you sure you want to move this notebook to ${selectedNotebookTitle}?`,
      other: `Are you sure you want to move these # notebooks ${selectedNotebookTitle}?`
    }),
  timeShort: {
    second: () => t`sec`,
    minute: () => t`min`,
    hour: () => t`hr`
  },
  backupEncrypted: () => t`Backup is encrypted`,
  password: () => t`Password`,
  renameTag: () => doActions.rename.tag(1),
  renameColor: () => doActions.rename.color(1),
  renameColorDesc: (color: string) => t`You are renaming color ${color}`,
  name: () => t`Name`,
  unlockToDelete: () => t`Unlock note to delete it`,
  backupRestored: () => t`Backup restored`,
  restoreFailed: () => t`Restore failed`,
  reorder: () => t`Reorder`,
  turnOffReminder: () => t`Turn off reminder`,
  turnOnReminder: () => t`Turn on reminder`,
  addShortcut: () => t`Add shortcut`,
  addNotebook: () => t`Add notebook`,
  removeAsDefault: () => t`Remove as default`,
  setAsDefault: () => t`Set as default`,
  moveNotes: () => t`Move notes`,
  unpin: () => t`Unpin`,
  pin: () => t`Pin`,
  lockedNotesPinnedFailed: () => t`Locked notes cannot be pinned`,
  notePreparingForShare: () => t`Preparing note for share`,
  removeFromNotebook: () => t`Remove from notebook`,
  attachments: () => t`Attachments`,
  attachedFiles: () => t`Attached files`,
  history: () => t`History`,
  copyLink: () => t`Copy link`,
  linkCopied: () => t`Link copied`,
  copyId: () => t`Copy ID`,
  idCopied: () => t`ID copied`,
  readOnly: () => t`Read only`,
  duplicate: () => t`Duplicate`,
  remindMe: () => t`Remind me`,
  unpinFromNotifications: () => t`Unpin notification`,
  pinToNotifications: () => t`Pin notification`,
  linkNotebooks: () => t`Link notebooks`,
  unlinkFromAll: () => t`Unlink from all`,
  removeFromAll: () => t`Remove from all`,
  assignTo: () => t`Assign to...`,
  addTags: () => t`Add tags`,
  addTagsDesc: () => t`Add tags to multiple notes at once`,
  references: () => t`References`,
  moveNotebookFix: () => t`Move notebook`,
  createNewNote: () => t`Create a new note`,
  encryptingAttachment: () => t`Encrypting attachment`,
  encryptingAttachmentDesc: (name = "attachment") =>
    t`Please wait while we encrypt ${name} for upload.`,
  fileTooLarge: () => t`File too big`,
  fileTooLargeDesc: (sizeInMB: string) =>
    t`File size should be less than ${sizeInMB}`,
  imageTooLarge: (sizeInMB: string) =>
    t`Image size should be less than ${sizeInMB}`,
  failToOpen: () => t`Failed to open`,
  fileMismatch: () => t`File mismatch`,
  noNoteProperties: () => t`Start writing to create a new note`,
  createNoteFirst: () => t`Create a note first`,
  noteLockedSave: () => t`This note is locked. Unlock note to save changes`,
  saveFailedVaultLocked: () => t`Save failed. Vault is locked`,
  yourFavorites: () => t`Your favorites`,
  yourNotes: () => t`Your notes`,
  yourTags: () => t`Your tags`,
  yourNotebooks: () => t`Your notebooks`,
  yourReminders: () => t`Your reminders`,
  yourArchive: () => t`Your archive`,
  favoritesEmpty: () => t`You have not favorited any notes yet`,
  notesEmpty: () => t`You have not created any notes yet`,
  tagsEmpty: () => t`You have not added any tags yet`,
  notebooksEmpty: () => t`You have not added any notebooks yet`,
  remindersEmpty: () => t`You have not set any reminders yet`,
  loadingFavorites: () => t`Loading your favorites`,
  loadingNotes: () => t`Loading your notes`,
  loadingTags: () => t`Loading your tags`,
  loadingNotebooks: () => t`Loading your notebooks`,
  loadingReminders: () => t`Loading your reminders`,
  loadingArchive: () => t`Loading your archive`,
  addFirstNote: () => t`Add your first note`,
  addFirstNotebook: () => t`Add your first notebook`,
  setReminder: () => t`Set a reminder`,
  codesCopied: () => t`Recovery codes copied!`,
  phoneNumberNotEntered: () => t`Phone number not entered`,
  codesSaved: () => t`Recovery codes saved!`,
  logsCopied: () => t`Debug log copied!`,
  logsDownloaded: () => t`Debug logs downloaded`,
  clearLogs: () => t`Clear logs`,
  clear: () => t`Clear`,
  clearLogsConfirmation: (key: string) =>
    t`Are you sure you want to clear all logs from ${key}?`,
  enterApplockPassword: () => t`Enter app lock password`,
  enterApplockPasswordDesc: () =>
    t`Please enter your app lock password to continue`,
  enterApplockPin: () => t`Enter app lock pin`,
  enterApplockPinDesc: () => t`Please enter your app lock pin to continue`,
  subDetails: () => t`Subscription details`,
  subEnded: () => t`Your subscription has ended`,
  subEndsOn: (date: string) => t`Your subscription ends on ${date}`,
  subRenewOn: (date: string) => t`Your subscription renews on ${date}`,
  neverHesitate: () => t`Never hesitate to choose privacy`,
  removeProfilePicture: () => t`Remove profile picture`,
  removeProfilePictureDesc: () => t`Remove your profile picture`,
  removeProfilePictureConfirmation: () =>
    t`Are you sure you want to remove your profile picture?`,
  removeFullName: () => t`Remove full name`,
  removeFullNameConfirmation: () =>
    t`Are you sure you want to remove your name?`,
  removeFullNameDesc: () => t`Remove your full name from profile`,
  manageAttachments: () => t`Manage attachments`,
  manageAttachmentsDesc: () => t`Manage your attachments in one place`,
  deleteAccountDesc: () =>
    t`Your account will be permanently deleted along with all your data, login credentials, and subscription information. This action is IRREVERSIBLE. Make sure you have saved a backup of your notes before proceeding.`,
  enterAccountPassword: () => t`Enter account password`,
  forcePullChanges: () => t`Force pull changes`,
  forcePullChangesDesc: () =>
    [
      t`Use this if changes from other devices are not appearing on this device. This will overwrite the data on this device with the latest data from the server.`,
      "",
      t`This must only be used for troubleshooting. Using it regularly for sync is not recommended and will lead to unexpected data loss and other issues. If you are having persistent issues with sync, please report them to us at support@streetwriters.co.`
    ].join("\n"),
  forcePushChanges: () => t`Force push changes`,
  forcePushChangesDesc: () =>
    [
      t`Use this if changes made on this device are not appearing on other devices. This will overwrite the data on the server with the data from this device.`,
      "",
      t`This must only be used for troubleshooting. Using it regularly for sync is not recommended and will lead to unexpected data loss and other issues. If you are having persistent issues with sync, please report them to us at support@streetwriters.co.`
    ].join("\n"),
  start: () => t`Start`,
  customization: () => t`Customization`,
  appearance: () => t`Appearance`,
  appearanceDesc: () =>
    t`Customize the appearance of the app with custom themes`,
  themes: () => t`Themes`,
  themesDesc: () => t`Choose from pre-built themes or create your own`,
  useSystemTheme: () => t`Use system theme`,
  useSystemThemeDesc: () =>
    t`Automatically switch between light and dark themes based on your system settings`,
  darkMode: () => t`Dark mode`,
  darkModeDesc: () => t`Use dark mode for the app`,
  behavior: () => t`Behavior`,
  behaviorDesc: () => t`Change how the app behaves in different situations`,
  homepage: () => t`Homepage`,
  homepageDesc: () => t`Default screen to open on app launch`,
  imageCompression: () => t`Image Compression`,
  imageCompressionDesc: () => t`Compress images before uploading`,
  askEveryTime: () => t`Ask every time`,
  enableRecommended: () => t`Enable (Recommended)`,
  dateFormat: () => t`Date format`,
  dateFormatDesc: () => t`Choose how dates are displayed in the app`,
  timeFormat: () => t`Time format`,
  timeFormatDesc: () => t`Choose how time is displayed in the app`,
  clearTrashInterval: () => t`Clear trash interval`,
  clearTrashIntervalDesc: () =>
    t`Automatically clear trash after a certain period of time`,
  clearDefaultNotebook: () => t`Clear default notebook`,
  clearDefaultNotebookDesc: () => t`Newly created notes will be uncategorized`,
  defaultNotebookCleared: () => t`Default notebook cleared`,
  editor: () => t`Editor`,
  editorDesc: () => t`Customize the note editor`,
  customizeToolbar: () => t`Customize toolbar`,
  customizeToolbarDesc: () => t`Customize the toolbar in the note editor`,
  resetToolbar: () => t`Reset toolbar`,
  resetToolbarDesc: () => t`Reset the toolbar to default settings`,
  toolbarReset: () => t`Toolbar reset to default preset`,
  doubleSpacedLines: () => t`Double spaced lines`,
  doubleSpacedLinesDesc: () =>
    t`New lines will be double spaced (old ones won't be affected).`,
  lineSpacingChanged: () => t`Line spacing changed`,
  defaultFontSize: () => t`Default font size`,
  defaultFontSizeDesc: () => t`Default font size in editor`,
  defaultFontFamily: () => t`Default font family`,
  defaultFontFamilyDesc: () => t`Default font family in editor`,
  titleFormat: () => t`Title format`,
  titleFormatDesc: () => t`Choose how the new note titles are formatted`,
  mardownShortcuts: () => t`Markdown shortcuts`,
  mardownShortcutsDesc: () => t`Use markdown shortcuts in the editor`,
  privacyAndSecurity: () => t`Privacy & security`,
  corsBypass: () => t`CORS bypass`,
  corsBypassDesc: () =>
    t`You can set a custom proxy URL to increase your privacy.`,
  vault: () => t`Vault`,
  vaultDesc: () => t`Multi-layer encryption to most important notes`,
  changeVaultPasswordDesc: () =>
    t`All locked notes will be re-encrypted with the new password.`,
  clearVaultDesc: () => t`Remove all notes from the vault.`,
  deleteVaultDesc: () => t`Delete vault (and optionally remove all notes).`,
  biometricUnlock: () => t`Biometric unlocking`,
  biometricUnlockDesc: () => t`Unlock your vault with biometric authentication`,
  revokeBiometricUnlock: () => t`Revoke biometric unlocking`,
  privacyMode: () => t`Privacy mode`,
  privacyModeDesc: () =>
    t`Hide app contents when you switch to other apps. This will also disable screenshot taking in the app.`,
  appLock: () => t`App lock`,
  appLockDesc: () => t`Lock the app with a password or pin`,
  enableAppLock: () => t`Enable app lock`,
  biometricsNotEnrolled: () => t`Biometrics not enrolled`,
  biometricsNotEnrolledDesc: () =>
    t`To use app lock, you must enable biometrics such as Fingerprint lock or Face ID on your phone.`,
  appLockTimeout: () => t`App lock timeout`,
  appLockTimeoutDesc: () =>
    t`Automatically lock the app after a certain period`,

  setupAppLockPin: () => t`Setup app lock pin`,
  setupAppLockPinDesc: () => t`Setup a pin to lock the app`,
  setupAppLockPassword: () => t`Setup app lock password`,
  setupAppLockPasswordDesc: () => t`Setup a password to lock the app`,
  changeAppLockPin: () => t`Change app lock pin`,
  changeAppLockPassword: () => t`Change app lock password`,
  changeAppLockPinDesc: () => t`Setup a new password for app lock`,
  changeAppLockPasswordDesc: () => t`Setup a new password for app lock`,
  removeAppLockPin: () => t`Remove app lock pin`,
  removeAppLockPassword: () => t`Remove app lock password`,
  removeAppLockPinDesc: () =>
    t`Remove app lock pin, app lock will be disabled if no other security method is enabled.`,
  removeAppLockPasswordDesc: () =>
    t`Remove app lock password, app lock will be disabled if no other security method is enabled.`,
  unlockWithBiometricsDesc: () =>
    t`Unlock the app with biometric authentication. This requires biometrics to be enabled on your device.`,
  appLockDisabled: () => t`App lock disabled`,
  backupRestore: () => t`Backup & restore`,
  backupsDesc: () => t`Manage your backups and restore data`,
  backupNow: () => t`Backup now`,
  backupNowWithAttachments: () => t`Backup now with attachments`,
  backupNowWithAttachmentsDesc: () =>
    t`Take a full backup of your data with all attachments`,
  backupNowDesc: () =>
    t`Take a partial backup of your data that does not include attachments`,
  automaticBackups: () => t`Automatic backups`,
  automaticBackupsDesc: () =>
    t`Set the interval to create a partial backup (without attachments) automatically.`,
  automaticBackupsWithAttachments: () => t`Automatic backups with attachments`,
  automaticBackupsWithAttachmentsDesc: () => [
    t`Set the interval to create a backup (with attachments) automatically.`,
    t`NOTE: Creating a backup with attachments can take a while, and also fail completely. The app will try to resume/restart the backup in case of interruptions.`
  ],
  selectBackupDir: () => t`Select backup directory`,
  selectBackupDirDesc: (path: string) => [
    t`Choose where to save your backups`,
    t`Current path: ${path}`
  ],
  noDirectorySelected: () => t`No directory selected`,
  changeBackupDir: () => t`Change backup directory`,
  backupEncryption: () => t`Backup encryption`,
  backupEncryptionDesc: () => t`Encrypt your backups for added security`,
  backupPasswordSet: () => t`Set a backup password`,
  backupPasswordDesc: () =>
    t`Backups will be encrypted with a key derived from this password. You will need it to restore them, so keep it somewhere safe. It cannot be recovered.`,
  backupPasswordRequired: () => t`Set a backup password first`,
  backupPasswordCleared: () => t`Backup password removed`,
  backupPasswordClearedDesc: () =>
    t`New backups will be written without encryption. Existing encrypted backups still need the old password.`,
  restoreBackup: () => t`Restore backup`,
  restoreBackupDesc: () => t`Restore your data from a backup`,
  exportAllNotes: () => t`Export all notes`,
  exportAllNotesDesc: () =>
    t`Export all notes as pdf, markdown, html or text in a single zip file`,
  productivity: () => t`Productivity`,
  quickNoteNotification: () => t`Quick note notification`,
  quickNoteNotificationDesc: () =>
    t`Quickly create a note from the notification`,
  reminders: () => t`Reminders`,
  remindersDesc: () => t`Manage your reminders`,
  reminderNotification: () => t`Reminder notifications`,
  reminderNotificationDesc: () =>
    t`Controls whether this device should receive reminder notifications.`,
  defaultSnoozeTime: () => t`Default snooze time`,
  defaultSnoozeTimeDesc: () =>
    t`Set the default time to snooze a reminder to when you press the snooze button on a notification.`,
  setSnoozeTimePlaceholder: () => t`Set snooze time in minutes`,
  changeNotificationSound: () => t`Change notification sound`,
  changeNotificationSoundDesc: () =>
    t`Change the sound that plays when you receive a notification`,
  helpAndSupport: () => t`Help and support`,
  reportAnIssue: () => t`Report an issue`,
  reportAnIssueDesc: () =>
    t`Faced an issue or have a suggestion? Click here to create a bug report`,
  debugging: () => t`Debugging`,
  debuggingDesc: () =>
    t`Get helpful debug info about the app to help us find bugs.`,
  debugLogs: () => t`Debug logs`,
  debugLogsDesc: () => t`View and share debug logs`,
  licenses: () => t`Open source licenses`,
  ossLibs: () => t`Open source libraries used in Sunshine Notes`,
  about: () => t`About`,
  checkForUpdates: () => t`Check for updates`,
  checkForUpdatesDesc: () => t`Check for new version of Sunshine Notes`,
  autoUpdateCheck: () => t`Check for updates automatically`,
  autoUpdateCheckDesc: () =>
    t`Check for new version of the app available on app launch`,
  appVersion: () => t`App version`,
  defaultSound: () => t`Default sound`,
  goToWebApp: () => t`Go to web app`,
  subOnWeb: () => t`Subscribed on web`,
  openInBrowserToManageSub: () => t`Open in browser to manage subscription`,
  editProfilePicture: () => t`Edit profile picture`,
  editProfilePictureDesc: () =>
    t`Your profile pictrure is stored 100% end-to-end encrypted and only visible to you.`,
  setFullName: () => t`Set full name`,
  setFullNameDesc: () =>
    t`Your name is stored 100% end-to-end encrypted and only visible to you.`,
  enterFullName: () => t`Enter full name`,
  deleteGroup: () => t`Delete group`,
  deleteGroupDesc: () =>
    t`All tools in this group will be removed from the toolbar.`,
  homePageChangedTo: (name: string) => t`Homepage changed to ${name}`,
  restartAppToApplyChanges: () => t`Restart the app to apply the changes`,
  deleteCollapsed: () => t`Delete collapsed section`,
  deleteCollapsedDesc: () =>
    t`All tools in the collapsed section will be removed`,
  clearTrash: () => t`Clear trash`,
  areYouSure: () => t`Are you sure?`,
  clearTrashConfirm: () => t`Are you sure you want to clear trash?`,
  trashCleared: () => t`Trash cleared successfully!`,
  trash: () => t`Trash`,
  loadingTrash: () => t`Loading trash`,
  trashCleanupIntervalTextDaily: () =>
    t`Trash gets automatically cleaned up daily`,
  trashCleanupIntervalTextDays: (days: number) =>
    t`Trash gets automatically cleaned up after ${days} days`,
  noTrashCleanupInterval: () =>
    t`Set automatic trash cleanup interval from Settings > Behaviour > Clean trash interval.`,
  select: () => t`Select`,
  backupComplete: () => t`Backup complete`,
  backupSaved: (platform: string) =>
    select(platform, {
      android: 'Backup file saved in "Sunshine Notes backups" folder on your phone.',
      other: "Backup file is saved in File Manager/Sunshine Notes folder"
    }),
  shareBackup: () => t`Share backup`,
  neverAskAgain: () => t`Never ask again`,
  backingUpData: (type?: "full" | "partial") =>
    t`Creating a${type === "full" ? " full" : ""} backup`,
  backupDataDesc: () =>
    t`All your backups are stored in 'Phone Storage/Sunshine Notes/backups/' folder`,
  backupSuccess: () => t`Backup successful`,
  biometricsAuthFailed: () =>
    t`Biometrics authentication failed. Please try again.`,
  biometricsAuthFailedDesc: () => t`Wait 30 seconds to try again`,
  biometricsAuthCancelled: () => t`Authentication cancelled by user`,
  biometricsAuthError: () => t`Authentication failed`,
  tryAgain: () => t`Tap to try again`,
  autoBackupsOffMessage: () => t`Automatic backups are off`,
  newUpdateMessage: () => t`New update available`,
  newUpdateActionText: () => t`Tap here to update to the latest version`,
  updateNow: () => t`Update now`,
  quickNoteTitle: () => t`Quick note`,
  quickNoteContent: () => t`Tap on "Take note" to add a note.`,
  takeNote: () => t`Take note`,
  quickNotePlaceholder: () => t`Write something...`,
  hide: () => t`Hide`,
  disable: () => t`Disable`,
  notificationsDisabled: () => t`Notifications disabled`,
  notificationsDisabledDesc: () =>
    t`Reminders cannot be set because notifications have been disabled from app settings. If you want to keep receiving reminder notifications, enable notifications for Sunshine Notes from app settings.`,
  openSettings: () => t`Open settings`,
  close: () => t`Close`,
  tips: [
    {
      text: () =>
        t`You can swipe left anywhere in the app to start a new note.`,
      contexts: ["notes", "first-note"]
    },
    {
      text: () => t`Long press on any item in list to enter multi-select mode.`,
      contexts: ["notes", "notebook", "notebook", "tags", "topics"]
    },
    {
      text: () =>
        t`You can pin frequently used Notebooks to the Side Menu to quickly access them.`,
      contexts: ["notebook", "notebooks"]
    },
    {
      text: () => t`A notebook can have unlimited topics with unlimited notes.`,
      contexts: ["notebook", "topics"]
    },
    {
      text: () =>
        t`You can multi-select notes and move them to a notebook at once`,
      contexts: ["notebook", "topics"]
    },
    {
      text: () => t`Mark important notes by adding them to favorites.`,
      contexts: ["notes"]
    },
    {
      text: () =>
        t`Are you scrolling a lot to find a specific note? Pin it to the top from Note properties.`,
      contexts: ["notes"]
    },
    {
      text: () =>
        t`You can view & restore older versions of any note by going to its properties -> History.`,
      contexts: ["notes"]
    }
  ],
  popups: [
    {
      id: "sortmenu",
      text: () => t`Tap here to change sorting`
    },
    {
      id: "jumpto",
      text: () => t`Tap here to jump to a section`
    },
    {
      id: "compactmode",
      text: () => t`Try compact mode to fit more items on screen`
    },
    {
      id: "searchreplace",
      text: () => t`Switch to search/replace mode`
    },
    {
      id: "notebookshortcut",
      text: () => t`Create shortcut of this notebook in side menu`
    }
  ],
  filterAttachments: () => t`Filter attachments by filename, type or hash`,
  newPassword: () => t`New password`,
  email: () => t`Email`,
  confirmPassword: () => t`Confirm password`,
  currentPin: () => t`Current pin`,
  currentPassword: () => t`Current password`,
  newPin: () => t`New pin`,
  confirmPin: () => t`Confirm pin`,
  colorTitle: () => t`Color title`,
  enterNotebookDescription: () => t`Enter notebook description`,
  searchNotebooks: () => t`Search notebooks`,
  issueTitlePlaceholder: () => t`Tell us what happened`,
  issuePlaceholder: () => t`Tell us more about the issue you are facing.

For example:
- What were you trying to do in the app?
- What did you expect to happen?
- Steps to reproduce the issue
- Things you have tried etc.`,
  searchSectionToLinkPlaceholder: () => t`Type # to search for headings`,
  searchNoteToLinkPlaceholder: () => t`Search a note to link to`,
  searchForTags: () => t`Search or add a tag`,
  searchANote: () => t`Search a note`,
  remindeMeOf: () => t`Remind me of...`,
  addShortNote: () => t`Add a short note`,
  searchingFor: (query: string) => t`Searching for ${query}...`,
  typeAKeyword: () => t`Type a keyword`,
  search: () => t`Search`,
  enterValidPhone: () => t`Please enter a valid phone number with country code`,
  errorGettingCodes: () => t`Error getting codes`,
  noResultsFound: (query?: string) =>
    query ? t`No results found for ${query}` : t`No results found`,
  routes: {
    Notes: () => t`Notes`,
    Notebooks: () => t`Notebooks`,
    Notebook: () => t`Notebook`,
    Favorites: () => t`Favorites`,
    Reminders: () => t`Reminders`,
    Trash: () => t`Trash`,
    Settings: () => t`Settings`,
    Tags: () => t`Tags`,
    Editor: () => t`Editor`,
    Home: () => t`Home`,
    Search: () => t`Search`,
    Archive: () => t`Archive`
  },
  searchInRoute: (
    routeName: keyof typeof SEARCH_IN_ROUTE_STRINGS | ({} & string)
  ) => {
    return (
      SEARCH_IN_ROUTE_STRINGS[
        routeName as keyof typeof SEARCH_IN_ROUTE_STRINGS
      ]?.() || t`Search in ${routeName}`
    );
  },
  databaseSetupFailed: () =>
    t`Database setup failed, could not get database key`,
  streamingNotSupported: () => t`Streaming not supported`,
  unableToResolveDownloadUrl: () => t`Unable to resolve download url`,
  errorApplyingPromoCode: () => t`Error applying promo code`,
  noNotificationPermission: () =>
    t`Please grant notifications permission to add new reminders.`,
  selectDayError: () => t`Please select the day to repeat the reminder on`,
  setTitleError: () => t`Please set title of the reminder`,
  dateError: () => t`Reminder time cannot be earlier than the current time.`,
  failedToDecryptBackup: () => t`Failed to decrypt backup`,
  backupDirectoryNotSelected: () => t`Backup directory not selected`,
  legal: () => t`Legal`,
  days: (days: number) =>
    plural(days, {
      one: `1 day`,
      other: `# days`
    }),
  daily: () => t`Daily`,
  weekly: () => t`Weekly`,
  monthly: () => t`Monthly`,
  yearly: () => t`Yearly`,
  minutes: (count: number) =>
    plural(count, {
      one: `1 minute`,
      other: `# minutes`
    }),
  hours: (count: number) =>
    plural(count, {
      one: `1 hour`,
      other: `# hours`
    }),
  immediately: () => t`Immediately`,
  "12-hour": () => t`12-hour`,
  "24-hour": () => t`24-hour`,
  noteTitle: () => t`Note title`,
  changesNotSaved: () => t`Your changes could not be saved`,
  savingNoteTakingTooLong: () =>
    t`Saving this note is taking too long. Copy your changes and restart the app to prevent data loss. If the problem persists, please report it to us at support@streetwriters.co.`,
  changesNotSavedDesc: () =>
    t`It seems that your changes could not be saved. What to do next:`,
  changesNotSavedStep1: () =>
    t`Tap on "Dismiss" and copy the contents of your note so they are not lost.`,
  changesNotSavedStep2: () => t`Restart the app.`,
  thisNoteLocked: () => t`This note is locked`,
  noteLockedBlockLink: () =>
    t`Linking to a specific block is not available for locked notes.`,
  dismiss: () => t`Dismiss`,
  totalWords: (words: number) =>
    plural(words, { one: "# word", other: "# words" }),
  addATag: () => t`Add a tag`,
  startWritingNote: () => t`Start writing your note...`,
  off: () => t`Off`,
  exportedNotesLocked: () =>
    t`Some exported notes are locked, Unlock to export them`,
  selectFolderForBackupFilesDesc: () =>
    t`Select folder where Sunshine Notes backup files are stored to view and restore them from the app`,
  selectBackupFolder: () => t`Select folder with backup files`,
  selectBackupFileDesc: () =>
    t`Select a backup file from your device to restore backup`,
  restoreFromFiles: () => t`Restore from files`,
  recentBackups: () => t`RECENT BACKUPS`,
  restoringBackup: () => t`Restoring backup...`,
  restoringBackupDesc: () => t`Please wait while we restore your backup...`,
  decryptingBackup: () => t`Backup is encrypted, decrypting...`,
  preparingBackupRestore: () => t`Preparing to restore backup file...`,
  readingBackupFile: () => t`Reading backup file...`,
  cleaningUp: () => t`cleaningUp`,
  extractingFiles: () => t`Extracting files...`,
  copyingBackupFileToCache: () => t`Copying backup files to cache`,
  backupEnterPassword: () => t`Please enter password of this backup file`,
  useEncryptionKey: () => t`Use encryption key`,
  testConnection: () => t`Test connection`,
  enterValidUrl: () => t`Please enter a valid URL`,
  serverNotFound: (host: string) => t`Server with host ${host} not found.`,
  couldNotConnectTo: (server: string) => t`Could not connect to ${server}.`,
  incorrectServerUrl: (url: string, server: string) =>
    t`The URL you have given (${url}) does not point to the ${server}.`,
  serverVersionMismatch: (title: string, url: string) =>
    t`The ${title} at ${url} is not compatible with this client.`,
  testConnectionBeforeSave: () =>
    t`Test connection before changing server urls`,
  restartAppToTakeEffect: () => t`Restart the app for changes to take effect.`,
  dismissAnnouncement: () => t`Dismiss announcement`,
  uploaded: () => t`Uploaded`,
  waitingForUpload: () => t`Waiting for upload`,
  webAuthTitles: [
    () => t`Write with freedom.`,
    () => t`Privacy comes first.`,
    () => t`Take notes privately.`,
    () => t`Encrypted, private, secure.`,
    () => "❤️ = 🔒 + 🗒️"
  ],
  restoreThisVersion: () => t`Restore this version`,
  autoSaveOff: () => t`Auto save: off`,
  selectedWords: (words: number) => plural(words, { other: "# selected" }),
  dropFilesToAttach: () => t`Drop your files here to attach`,
  loadingEditor: () => t`Loading editor. Please wait...`,
  noHeadingsFound: () => t`No headings found`,
  somethingWentWrong: () => t`Something went wrong`,
  whatWentWrong: () => t`What went wrong?`,
  howToFix: () => t`How to fix it?`,
  fixIt: () => t`Fix it`,
  reloadApp: () => t`Reload app`,
  contactSupport: () => t`Contact support`,
  databaseCorruptExplain: () =>
    t`This error usually means the database file is either corrupt or it could not be decrypted.`,
  databaseCorruptFix: () =>
    t`This error can only be fixed by wiping & reseting the database. Beware that this will wipe all your data inside the database with no way to recover it later on. This WILL NOT change/affect/delete/wipe your data on the server but ONLY on this device.`,
  decryptKeyErrorExplain: () =>
    t`This error means the at rest encryption key could not be decrypted. This can be due to data corruption or implementation change.`,
  decryptKeyErrorFix: () =>
    t`This error can only be fixed by wiping & reseting the Key Store and the database. This WILL NOT change/affect/delete/wipe your data on the server but ONLY on this device.`,
  searchIndexCorrupt: () =>
    t`This error usually means the search index is corrupted.`,
  searchIndexCorruptFix: () =>
    t`This error can be fixed by rebuilding the search index. This action won't result in any kind of data loss.`,
  nativeFeatures: () => [
    t`Native high-performance encryption`,
    t`Automatic backups`,
    t`Pin notes in notifications drawer`,
    t`Share & append to notes from anywhere`,
    t`Quick note widgets`,
    t`App lock`
  ],
  loading: () => t`Loading`,
  errorsInAttachments: (count: number) => t`Errors in ${count} attachments`,
  goToNextPage: () => t`Go to next page`,
  goToPreviousPage: () => t`Go to previous page`,
  zoomOut: () => t`Zoom out`,
  zoomIn: () => t`Zoom in`,
  enterFullScreen: () => t`Enter fullscreen`,
  items: () => t`items`,
  downloadingImages: () => t`Downloading images`,
  checkingForUpdates: () => t`Checking for updates`,
  updating: (percentage: number) => t`${percentage}% updating...`,
  updateCompleted: (version: string) =>
    `v${version} downloaded (click to install)`,
  updateNewVersionAvailable: (version: string) => t`v${version} available`,
  unlocking: () => t`Unlocking`,
  reminderStarts: (date: string, time: string) =>
    t`The reminder will start on ${date} at ${time}.`,
  files: (count: number) =>
    plural(count, {
      one: "# file",
      other: "# files"
    }),
  of: () => t`of`,
  installs: () => t`installs`,
  licenseUnder: (license: string) => t`Licensed under ${license}`,
  pro: () => t`Pro`,
  scanQrError: () =>
    t`If you can't scan the QR code above, enter this text instead (spaces don't matter)`,
  sms: () => t`phone number`,
  app: () => t`authentication app`,
  transactionStatusToText: (
    key: keyof typeof TRANSACTION_STATUS | ({} & string)
  ) => {
    return key in TRANSACTION_STATUS
      ? TRANSACTION_STATUS[key as keyof typeof TRANSACTION_STATUS]()
      : key;
  },
  viewReceipt: () => t`View receipt`,
  customDictWords: (count: number) =>
    t`You have ${count} custom dictionary words.`,
  notesImported: () => t`notes imported`,
  importCompleted: () => t`Import completed`,
  errorsOccured: (count: number) =>
    plural(count, {
      one: "# error occured",
      other: "# errors occured"
    }),
  startOver: () => t`Start over`,
  filesReadyToImport: (count: number) =>
    plural(count, {
      one: "# file ready for import",
      other: "# files ready for import"
    }),
  selectFilesToImport: () => t`Select files to import`,
  dropFilesHere: () => t`Drop the files here`,
  dragAndDropFiles: () => t`Drag & drop files here, or click to select files`,
  onlyZipSupported: () => t`Only .zip files are supported.`,
  clickToRemove: () => t`Click to remove`,
  appWillReloadIn: (sec: number) => t`App will reload in ${sec} seconds`,
  changesReflectOnStart: () =>
    t`Your changes have been saved and will be reflected after the app has refreshed.`,
  edit: () => t`Edit`,
  yourFullName: () => t`Your full name`,
  memberSince: (date: string) => t`Member since ${date}`,
  loggingIn: () => t`Logging you in`,
  notebooksAllCaps: () => t`NOTEBOOKS`,
  backupFileMethod: () => t`Use a backup file`,
  clearDataAndResetMethod: () => t`Clear data & reset account`,
  clearDataAndResetMethodDesc: () =>
    t`EXTREMELY DANGEROUS! This action is irreversible. All your data including notes, notebooks, attachments & settings will be deleted. This is a full account reset. Proceed with caution.`,

  browse: () => t`Browse`,
  dontShowAgain: () => t`Don't show again`,
  dontShowAgainConfirm: () => t`Don't show again on this device?`,
  toggleDarkLightMode: () => t`Toggle dark/light mode`,
  goTo: () => t`Go to`,
  goToTag: (tag: string) => t`Go to #${tag}`,
  tagNotFound: () => `Tag not found`,
  downloadAllAttachments: () => t`Download all attachments`,
  selectProfilePicture: () => t`Select profile picture`,
  changeProfilePicture: () => t`Change profile picture`,
  editFullName: () => t`Edit your full name`,
  reset: () => t`Reset`,
  resetSelection: () => t`Reset selection`,
  startImportingNow: () => t`Start importing now`,
  tryFreeFor14Days: () => t`Try free for 14 days`,
  startImport: () => t`Start import`,
  cancelSub: () => t`Cancel subscription`,
  unlockWithSecurityKey: () => t`Unlock with security key`,
  skipAndGoToApp: () => t`Use offline`,
  dontHaveBackupFile: () => t`Don't have backup file?`,
  filterLanguages: () => t`Filter languages`,
  searchThemes: () => t`Search themes`,
  olderVersion: () => t`Older version`,
  currentNote: () => t`Current note`,
  incomingNote: () => t`Incoming note`,
  description: () => t`Description`,
  date: () => t`Date`,
  month: () => t`Month`,
  day: () => t`Day`,
  time: () => t`Time`,
  encryptionKey: () => t`Encryption key`,
  color: () => t`Color`,
  phoneNumber: () => t`Phone number`,
  selectBackupFile: () => t`Select backup file`,
  optional: () => t`Optional`,
  backupFileHelpText: () => t`Backup files have .nnbackup extension`,
  downloadBackupFile: () => t`Download backup file`,
  openNote: () => t`Open note`,
  properties: () => t`Properties`,
  clickToPreview: () => t`Click to preview`,
  clearCache: () => t`Clear cache`,
  clearCacheDesc: (cacheSize: number) =>
    t`Clear all cached attachments. Current cache size: ${cacheSize}`,
  clearCacheConfirm: () => t`Clear attachments cache?`,
  clearCacheConfirmDesc:
    () => t`Clearing attachments cache will perform the following actions:

- Downloaded images & files: **cleared**
- Pending uploads: **cleared**
- Uploaded images & files: _unaffected_

All attachments will be downloaded & cached again on access.

---

**Only use this for troubleshooting purposes. If you are having persistent issues, it is recommended that you reach out to us via support@streetwriters.co so we can help you resolve it permanently.**`,
  cacheCleared: () => t`Attachments cache cleared!`,
  gettingEncryptionKey: () => t`Getting encryption key...`,
  keyBackedUp: () => t`I have saved my key`,
  groupAdded: () => t`Group added successfully`,
  welcomeBack: () => t`Welcome back!`,
  coreRequired: () => t`2FA code is required()`,
  backupYourData: () => `Backup your data`,
  backupYourDataDesc: () =>
    t`Please download a backup of your data as your account will be cleared before recovery.`,
  backingUpDataWait: () =>
    t`We are creating a backup of your data. Please wait...`,
  upgradeNow: () => t`Upgrade now`,
  backupSavedAt: (path: string) => t`Backup saved at ${path}`,
  irreverisibleAction: () => t`This action is IRREVERSIBLE.`,

  doActions,
  actions,
  inProgressActions,
  actionErrors,
  actionConfirmations,

  deleting: () => t`Deleting`,
  backupReadyToDownload: () => t`Your backup is ready to download`,
  vaultUnlocked: () => t`Vault unlocked`,
  vaultLocked: () => t`Vault locked`,
  unlockVault: () => t`Unlock vault`,
  unlockVaultDesc: () => t`Please enter your vault password to continue`,
  imagePreviewFailed: () => t`This image cannot be previewed`,
  attachmentPreviewFailed: () => t`Attachment preview failed`,
  failedToCopyNote: () => t`Failed to copy note`,
  noteDoesNotExist: () => t`Note does not exist`,
  couldNotConvertNote: (format: string) =>
    t`Could not convert note to ${format}.`,
  remindersNotSupported: () =>
    t`Reminders will not be active on this device as it does not support notifications.`,
  invalidHexColor: () => t`Please enter a valid hex color (e.g. #ffffff)`,
  profileUpdated: () => t`Profile updated`,
  assignedToNotebookMessage: (
    notes: number,
    added: number,
    removed: number
  ) => {
    const n = plural(notes, {
      one: `1 note`,
      other: `# notes`
    });
    if (added === 0 && removed > 0)
      return t`${n} ${plural(removed, {
        one: `removed from 1 notebook`,
        other: `removed from # notebooks`
      })}.`;
    else if (added > 0 && removed === 0)
      return t`${n} ${plural(added, {
        one: `added to 1 notebook`,
        other: `added to # notebooks`
      })}.`;
    else
      return t`${n} ${plural(added, {
        one: `added to 1 notebook`,
        other: `added to # notebooks`
      })} and ${plural(removed, {
        one: `removed from 1 notebook`,
        other: `removed from # notebooks`
      })}.`;
  },
  noEncryptionKeyFound: () => t`No encryption key found`,
  pleaseTryAgain: () => t`Please try again`,
  securityKeyRegistered: () => t`Security key successfully registered.`,
  restartNow: () => t`Restart now`,
  copied: () => t`Copied`,
  invalidCors: () => t`Invalid CORS proxy url`,
  vaultCleared: () => t`Vault cleared`,
  vaultDeleted: () => t`Vault deleted`,
  subgroupAdded: () => t`Subgroup added`,
  subCanceled: () => t`Your subscription has been canceled.`,
  refundIssued: () =>
    t`Your refund has been issued. Please wait 24 hours before reaching out to us in case you do not receive your funds.`,
  failedToInstallTheme: () => t`Failed to install theme.`,
  fullNameUpdated: () => t`Full name updated`,
  shortcutRemoved: () => t`Shortcut removed`,
  recheckFailed: () => t`Rechecking failed`,
  failedToDelete: () => t`Failed to delete`,
  failedToRegisterTask: () => t`Failed to register task`,
  couldNotClearTrash: () => t`Could not clear trash.`,
  automaticBackupsDisabled: () => t`Automatic backups disabled`,
  automaticBackupsDisabledDesc: () =>
    t`Please enable automatic backups to avoid losing important data.`,
  default: () => t`Default`,
  minimal: () => t`Minimal`,
  custom: () => t`Custom`,
  disableEditorMargins: () => t`Disable editor margins`,
  enableEditorMargins: () => t`Enable editor margins`,
  exitFullScreen: () => t`Exit fullscreen`,
  normalMode: () => t`Normal mode`,
  focusMode: () => t`Focus mode`,
  closeOthers: () => t`Close others`,
  closeToRight: () => t`Close to the right`,
  closeToLeft: () => t`Close to the left`,
  closeAll: () => t`Close all`,
  revealInList: () => t`Reveal in list`,
  keepOpen: () => t`Keep open`,
  orderBy: () => t`Order by`,
  oldestToNewest: () => t`Oldest - newest`,
  newestToOldest: () => t`Newest - oldest`,
  sort: () => t`Sort`,
  jumpToGroup: () => t`Jump to group`,
  rotateLeft: () => t`Rotate left`,
  rotateRight: () => t`Rotate right`,
  website: () => t`Website`,
  resetSidebar: () => t`Reset sidebar`,
  removeColor: () => doActions.remove.color(1),
  favorite: () => t`Favorite`,
  assignColor: () => t`Assign color`,
  print: () => t`Print`,
  exportAs: (format?: string) => t`Export as${format ? " " + format : ""}`,
  copyAs: (format?: string) => t`Copy as${format ? " " + format : ""}`,
  activate: () => t`Activate`,
  deactivate: () => t`Deactivate`,
  minimize: () => t`Minimize`,
  maximize: () => t`Maximize`,
  size: () => t`Size`,
  dateUploaded: () => t`Date uploaded`,
  editingTagDesc: (tag: string) => t`You are editing #${tag}`,
  applyingChanges: () => t`Applying changes`,
  thisMayTakeAWhile: () => t`This may take a while`,
  processing: () => t`Processing...`,
  processingCollection: (collection: string) => t`Processing ${collection}...`,
  root: () => t`Root`,
  credientials: () => t`Credentials`,

  congratulations: () => t`Congratulations!`,
  securityKey: () => t`Security key`,
  securityKeyDescription: () =>
    t`The security key for unlocking the app. This is the most secure method.`,
  unregister: () => t`Unregister`,
  register: () => t`Register`,
  securityKeyUsername: () => t`Enter your username`,
  securityKeyUsernameDesc: () =>
    t`This username will be used to distinguish between different credentials in your security key. Make sure it is unique.`,
  general: () => t`General`,
  zoomFactor: () => t`Zoom factor`,
  zoomFactorDescription: () => t`Zoom in or out the app content.`,
  colorScheme: () => t`Color scheme`,
  colorSchemeDescription: () => t`Dark or light, we won't judge.`,
  auto: () => t`Auto`,
  selectTheme: () => t`Select a theme`,
  partialBackupDescription: () =>
    t`Partial backups contain all your data except attachments. They are created from data already available on your device and do not require an Internet connection.`,
  chooseBackupFormat: () => t`Choose backup format`,
  backup: () => t`Backup`,
  backupWithAttachments: () => t`Backup with attachments`,
  dateAndTime: () => t`Date & time`,
  desktopApp: () => t`Desktop app`,
  automaticUpdates: () => t`Automatic updates`,
  automaticUpdatesDesc: () =>
    t`Automatically download & install updates in the background without prompting first.`,
  desktopIntegration: () => t`Desktop integration`,
  autoStartOnSystemStartup: () => t`Auto start on system startup`,
  startMinimized: () => t`Start minimized`,
  minimizeToSystemTray: () => t`Minimize to system tray`,
  minimizeToSystemTrayDescription: () =>
    t`Pressing "—" will hide the app in your system tray.`,
  closeToSystemTray: () => t`Close to system tray`,
  closeToSystemTrayDescription: () =>
    t`Pressing "X" will hide the app in your system tray.`,
  useNativeTitlebar: () => t`Use native titlebar`,
  useNativeTitlebarDescription: () =>
    t`Use native OS titlebar instead of replacing it with a custom one. Requires app restart for changes to take effect.`,
  spellCheck: () => t`Spell check`,
  enableSpellChecker: () => t`Enable spell checker`,
  languages: () => t`Languages`,
  spellCheckerLanguagesDescription: () =>
    t`Select the languages the spell checker should check in.`,
  customDictionaryWords: () => t`Custom dictionary words`,
  toolbar: () => t`Toolbar`,
  profile: () => t`Profile`,
  behaviour: () => t`Behaviour`,
  notifications: () => t`Notifications`,
  importExport: () => t`Import & export`,
  backupExport: () => t`Backup & export`,
  securityPrivacy: () => t`Security & privacy`,
  privacy: () => t`Privacy`,
  other: () => t`Other`,
  newVersionAvailable: (version: string) =>
    `New version (v${version}) is available for download.`,
  installUpdate: () => t`Install update`,
  sourceCode: () => t`Source code`,
  viewSourceCode: () => t`View source code`,
  checkRoadmap: () => t`Check roadmap`,
  availableOnIOS: () => t`Available on iOS`,
  availableOnIOSAndAndroid: () => t`Available on iOS & Android`,
  joinCommunity: () => t`Join community`,
  license: () => t`License`,
  licenseDescription: () => t`GNU GENERAL PUBLIC LICENSE Version 3`,
  follow: () => t`Follow`,
  report: () => t`Report`,
  send: () => t`Send`,
  hideNoteTitle: () => t`Hide note title`,
  hideNoteTitleDescription: () =>
    t`Prevent note title from appearing in tab/window title.`,
  advanced: () => t`Advanced`,
  useCustomDns: () => t`Use custom DNS`,
  changeProxy: () => t`Change proxy`,
  proxy: () => t`Proxy`,
  proxyDescription: () =>
    t`Setup an HTTP/HTTPS/SOCKS proxy.

For example:
http://foobar:80
socks4://proxy.example.com
http://username:password@foobar:80

To remove the proxy, simply erase everything in the input.`,
  loggedOut: () => t`You have been logged out.`,
  clearSessions: () => t`clear sessions`,
  loggedOutAllOtherDevices: () =>
    t`You have been logged out from all other devices.`,
  paymentMethod: () => t`Payment method`,
  changePaymentMethodDescription: () =>
    t`Change the payment method you used to purchase this subscription.`,
  failedToTakeBackup: () => t`Failed to take backup`,
  failedToTakeBackupMessage: () =>
    t`Failed to take backup of your data. Do you want to continue logging out?`,
  understand: () => t`I understand`,
  checkingAttachments: () => `Checking attachments`,
  orderId: () => t`Order ID`,
  amount: () => t`Amount`,
  status: () => t`Status`,
  receipt: () => t`Receipt`,
  subgroupOne: () => t`Subgroup 1`,
  goBackToNotebooks: () => t`Go back to notebooks`,
  goBackToTags: () => t`Go back to tags`,
  okay: () => t`Okay`,
  clearTrashDesc: () =>
    t`Clearing trash will permanently delete all the items in your trash. This action is IRREVERSIBLE.`,
  createdAt: () => t`Created at`,
  lastEditedAt: () => t`Last edited at`,
  enter6DigitCode: () =>
    t`Please confirm your identity by entering the authentication code from your authenticator app.`,
  insertLink: () => t`Insert link`,
  editLink: () => t`Edit link`,
  insert: () => t`Insert`,
  moveToTrashDesc: (interval: number) =>
    t`These items will be **kept in your Trash for ${interval} days** after which they will be permanently deleted.`,
  editNotebookDesc: (notebookTitle: string) =>
    t`You are editing "${notebookTitle}".`,
  newNotebookDesc: () => t`Notebooks are the best way to organize your notes.`,
  encryptedBackup: () => t`Encrypted backup`,
  encryptedBackupDesc: () =>
    t`Please enter the password to decrypt and restore this backup.`,
  addToDictionary: () => t`Add to dictionary`,
  cut: () => t`Cut`,
  copyLinkText: () => t`Copy link text`,
  copyImage: () => t`Copy image`,
  paste: () => t`Paste`,
  pasteAndMatchStyle: () => t`Paste and match style`,
  pasteWithoutFormatting: () => t`Paste without formatting`,
  configure: () => t`Configure`,
  usingInstance: (instance: string, version: string) =>
    t`Using ${instance} (v${version})`,

  bold: () => t`Bold`,
  italic: () => t`Italic`,
  underline: () => t`Underline`,
  strikethrough: () => t`Strikethrough`,
  noteLink: () => t`Bi-directional note link`,
  link: () => t`Link`,
  linkEdit: () => t`Edit link`,
  linkRemove: () => t`Remove link`,
  openLink: () => t`Open link`,
  // copyLink: () => t`Copy link`,
  linkSettings: () => t`Link settings`,
  code: () => t`Code`,
  codeRemove: () => t`Code remove`,
  formatClear: () => t`Clear all formatting`,
  superscript: () => t`Superscript`,
  subscript: () => t`Subscript`,
  // insert: () => t`Insert`,
  bulletList: () => t`Bullet list`,
  numberedList: () => t`Numbered list`,
  checklist: () => t`Checklist`,
  fontFamily: () => t`Font family`,
  fontSize: () => t`Font size`,
  headings: () => t`Headings`,
  alignCenter: () => t`Align center`,
  ltr: () => t`Text direction`,
  highlight: () => t`Highlight`,
  textColor: () => t`Text color`,
  mathInline: () => t`Math (inline)`,
  tableSettings: () => t`Table settings`,
  columnProperties: () => t`Column properties`,
  rowProperties: () => t`Row properties`,
  cellProperties: () => t`Cell properties`,
  insertColumnLeft: () => t`Insert column left`,
  insertColumnRight: () => t`Insert column right`,
  moveColumnLeft: () => t`Move column left`,
  moveColumnRight: () => t`Move column right`,
  deleteColumn: () => t`Delete column`,
  splitCells: () => t`Split cells`,
  mergeCells: () => t`Merge cells`,
  insertRowAbove: () => t`Insert row above`,
  insertRowBelow: () => t`Insert row below`,
  moveRowUp: () => t`Move row up`,
  moveRowDown: () => t`Move row down`,
  deleteRow: () => t`Delete row`,
  deleteTable: () => t`Delete table`,
  cellBackgroundColor: () => t`Cell background color`,
  backgroundColor: () => t`Background color`,
  cellBorderColor: () => t`Cell border color`,
  cellTextColor: () => t`Cell text color`,
  cellBorderWidth: () => t`Cell border width`,
  none: () => t`None`,
  imageSettings: () => t`Image settings`,
  // alignCenter: () => t`Align center`,
  alignLeft: () => t`Align left`,
  alignRight: () => t`Align right`,
  imageProperties: () => t`Image properties`,
  previewAttachment: () => t`Preview attachment`,
  more: () => t`More`,
  attachmentSettings: () => t`Attachment settings`,
  downloadAttachment: () => t`Download attachment`,
  removeAttachment: () => t`Remove attachment`,
  embedSettings: () => t`Embed settings`,
  // alignCenter: () => t`Align center`,
  // alignLeft: () => t`Align left`,
  // alignRight: () => t`Align right`,
  embedProperties: () => t`Embed properties`,
  webclipSettings: () => t`Web clip settings`,
  fullscreen: () => t`Full screen`,
  openInNewTab: () => t`Open in new tab`,
  openSource: () => t`Open source`,
  outdent: () => t`Lift list item`,
  indent: () => t`Sink list item`,

  chooseBlockToInsert: () => t`Choose a block to insert`,
  horizontalRule: () => t`Horizontal rule`,
  codeBlock: () => t`Code block`,
  quote: () => t`Quote`,
  mathAndFormulas: () => t`Math & formulas`,
  callout: () => t`Callout`,
  image: () => t`Image`,
  insertImage: () => t`Insert an image`,
  uploadFromDisk: () => t`Upload from disk`,
  takePhotoUsingCamera: () => t`Take a photo using camera`,
  table: () => t`Table`,
  insertTable: () => t`Insert a table`,
  numberedTable: () => t`Numbered table`,
  toggleRowNumbering: () => t`Row numbering`,
  embed: () => t`Embed`,
  insertEmbed: () => t`Insert an embed`,
  attachment: () => t`Attachment`,
  taskList: () => t`Task list`,
  outlineList: () => t`Outline list`,
  attachImageFromURL: () => t`Attach image from URL`,

  paragraph: () => t`Paragraph`,
  heading: (level: number) => t`Heading ${level}`,

  toggleIndentationMode: () => t`Toggle indentation mode`,
  changeLanguage: () => t`Change language`,
  selectLanguage: () => t`Select language`,
  spaces: () => t`Spaces`,
  lineColumn: (line: number, column: number) =>
    t`Line ${line}, Column ${column}`,
  selectedCode: (selected: number) => t`${selected} selected`,
  searchLanguages: () => t`Search languages`,

  untitled: () => t`Untitled`,
  readonlyTaskList: () => t`Make task list readonly`,
  sortTaskList: () => t`Move all checked tasks to bottom`,
  clearCompletedTasks: () => t`Clear completed tasks`,

  chooseCustomColor: () => t`Choose custom color`,
  deleteMode: () => t`Delete mode`,

  fromURL: () => t`From URL`,
  enterEmbedSourceURL: () => t`Enter embed source URL`,
  pasteEmbedCode: () => t`Paste embed code here. Only iframes are supported.`,
  fromCode: () => t`From code`,

  expand: () => t`Expand`,
  matchCase: () => t`Match case`,
  matchWholeWord: () => t`Match whole word`,
  replace: () => t`Replace`,
  replaceAll: () => t`Replace all`,
  nextMatch: () => t`Next match`,
  previousMatch: () => t`Previous match`,
  toggleReplace: () => t`Toggle replace`,
  enableRegex: () => t`Enable regex`,

  width: () => t`Width`,
  height: () => t`Height`,
  pasteImageURL: () => t`Paste image URL here`,
  linkText: () => t`Link text`,
  url: () => t`URL`,

  insertTableOfSize: (rows: number, columns: number) =>
    t`Insert a ${rows}x${columns} table`,
  insertNumberedTableOfSize: (rows: number, columns: number) =>
    t`Insert a ${rows}x${columns} numbered table`,
  rankColumnNotice: () =>
    t`A narrow rank column is added on the left for the numbers.`,
  setTableSizeNotice: () => t`Please set a table size`,
  clickToReset: (title: string) => t`Click to reset ${title}`,
  increase: (title: string) => t`Increase ${title}`,
  decrease: (title: string) => t`Decrease ${title}`,
  saved: () => t`Saved`,
  saving: () => t`Saving`,
  attachmentRecheckCancelled: () => t`Attachment recheck cancelled`,
  recheckAll: () => t`Recheck all`,
  attachmentRecheckComplete: () => t`Attachments recheck complete`,
  checkingNoteAttachments: () => t`Checking note attachments`,
  checkingAllAttachments: () => t`Checking all attachments`,
  passed: () => t`Passed`,
  failed: () => t`Failed`,
  cacheClearedDesc: () => t`All cached attachments have been cleared.`,
  restoreBackupConfirm: () => t`Restore backup?`,
  prioritySupport: () => t`Get Priority support`,
  boostProductivityNotebook: () =>
    t`Boost your productivity with Notebooks and organize your notes.`,
  notebookNotes: () => t` "Notebook > Notes"`,
  notebookNotesDesc: () => t`Every Notebook can have notes and sub notebooks.`,
  workAndOffice: () => t`Work & Office`,
  workAndOfficeDesc: () => t`Everything related to my job in one place.`,
  tasks: () => t`Tasks`,
  taskAValue: () => t`February 2022 Week 2`,
  taskBValue: () => t`February 2022 Week 3`,
  meetings: () => t`Meetings`,
  easyAccess: () => t`Easy access`,
  easyAccessDesc: () =>
    t`You can create shortcuts of frequently accessed notebooks in the side menu`,
  schoolWork: () => t`School work`,
  schoolWorkDesc: () => t`Everything related to my school in one place.`,
  recipes: () => t`Recipes`,
  recipesDesc: () => t`I love cooking and collecting recipes.`,
  error: () => t`Error`,
  deleteContainingNotes: (count: number) =>
    plural(count, {
      one: `Move all notes in this notebook to trash`,
      other: `Move all notes in these notebooks to trash`
    }),
  redeem: () => t`Redeem`,
  searchForNotesNotebooksAndTags: () =>
    t`Search for notes, notebooks, and tags...`,
  executeACommand: () => t`Execute a command...`,
  execute: () => t`Execute`,
  quickOpen: () => t`Quick open`,
  commandPalette: () => t`Command palette`,
  navigate: () => t`Navigate`,
  nextTab: () => t`Next tab`,
  previousTab: () => t`Previous tab`,
  goForwardInTab: () => t`Go forward in tab`,
  goBackInTab: () => t`Go back in tab`,
  attachmentManager: () => t`Attachment manager`,
  newTag: () => t`New tag`,
  closeCurrentTab: () => t`Close current tab`,
  closeAllTabs: () => t`Close all tabs`,
  toggleTheme: () => t`Toggle theme`,
  actionsForNote: (title: string) => t`Actions for note: ${title}`,
  actionsForNotebook: (title: string) => t`Actions for notebook: ${title}`,
  actionsForTag: (title: string) => t`Actions for tag: ${title}`,
  recents: () => t`Recents`,
  removeFromRecents: () => t`Remove from recents`,
  releaseTrack: () => t`Release track`,
  stable: () => t`Stable`,
  beta: () => t`Beta`,
  zoom: () => t`Zoom`,
  toggleFocusMode: () => t`Toggle focus mode`,
  fontLigatures: () => t`Font ligatures`,
  fontLigaturesDesc: () =>
    t`Enable ligatures for common symbols like →, ←, etc`,
  expandSidebar: () => t`Expand sidebar`,
  viewAllLimits: () => `View all limits`,
  freePlan: () => t`Free plan`,
  proPlan: () => t`Pro plan`,
  essentialPlan: () => t`Essential plan`,
  believerPlan: () => t`Believer plan`,
  storage: () => t`Storage`,
  used: () => t`used`,
  editProfile: () => t`Edit profile`,
  linkNotes: () => t`Link notes`,
  linkingNotesTo: (title: string) => t`Select notes to link to "${title}"`,
  addToNotebook: () => t`Add to notebook`,
  notebookAdded: () => t`Notebook added`,
  addNotes: () => t`Add notes`,
  setAsHomepage: () => t`Set as homepage`,
  defaultSidebarTab: () => t`Default sidebar tab`,
  defaultSidebarTabDesc: () => t`Select the default sidebar tab`,
  unsetAsHomepage: () => t`Reset homepage`,
  archive: () => t`Archive`,
  yourArchiveIsEmpty: () => t`Your archive is empty`,
  unarchive: () => t`Unarchive`,
  moveNotebookDesc: () =>
    t`Select a notebook to move this notebook into, or unselect to move it to the root level.`,
  words: () => t`Words`,
  characters: () => t`Characters`,
  paragraphs: () => t`Paragraphs`,
  noNotebooksSelectedToMove: () => t`No notebooks selected to move`,
  scrollToTop: () => t`Scroll to top`,
  scrollToBottom: () => t`Scroll to bottom`,
  charactersCount: (count: number) => t`${count} characters`,
  upgrade: () => t`Upgrade`,
  checkoutFaqs: [
    {
      question: () => t`What happens to my data if I switch plans?`,
      answer: () =>
        t`Your data remains 100% accessible regardless of what plan you are on. That includes your notes, notebooks, attachments, and anything else you might have created.`
    },
    {
      question: () =>
        t`Why do you need my credit card details for a free trial?`,
      answer: () =>
        t`We require credit card details to fight abuse and to make it seamless for you to upgrade. Your credit card is NOT charged until your free trial ends and your subscription starts. You will be notified via email of the upcoming charge before your trial ends.`
    },
    {
      question: () => t`Can I cancel my free trial anytime?`,
      answer: () =>
        t`Yes, you can cancel your trial anytime. No questions asked.`
    },
    {
      question: () => t`What is your refund policy?`,
      answer: () =>
        t`For a monthly subscription, you can get a refund within 7 days of purchase. For a yearly subscription, we offer a full refund within 14 days of purchase. For a 5 year subscription, you can request a refund within 30 days of purchase.`
    }
  ],
  tryItForFree: () => t`Try it for free`,
  getThisAndSoMuchMore: () => t`Get this and so much more:`,
  cloudSpace: () => t`cloud storage space for storing images and files.`,
  appLockFeatureBenefit: () =>
    t`for locking your notes as soon as app enters background`,
  plan: (plan: string) => t`${plan} plan`,
  percentOff: (discount: string) => `${discount}% off`,
  recommendedByPrivacyGuides: () => t`Recommended by Privacy Guides`,
  featuredOn: () => t`Featured on`,
  faqs: () => t`FAQs`,
  hdImages: () => t`hdImages`,
  billedAnnually: (price: string) => t`billed annually at ${price}`,
  billedMonthly: (price: string) => t`billed monthly at ${price}`,
  dueToday: () => t`Due today`,
  daysFree: (days: string) => t`${days} days free`,
  due: (date: string) => t`Due ${date}`,
  "5yearPlanConditions": () => [
    t`One time purchase, no auto-renewal`,
    t`Pay once and use for 5 years`
  ],
  trialPlanConditions: [
    (duration: number) => t`Free ${duration} day trial, cancel any time`,
    (platform: "ios" | "android") =>
      t`${
        platform === "ios" ? "Apple" : "Google"
      } will remind you before your trial ends`
  ],
  subscribe: () => t`Subscribe`,
  cancelAnytimeAlt: () => t`Cancel anytime, subscription auto-renews.`,
  subTerms: [
    () => t`By joining you agree to our`,
    () => t`privacy policy`,
    () => t`and`,
    () => t`terms of use.`
  ],
  bestValue: () => t`Best value`,
  unlimited: () => t`Unlimited`,
  educationPlan: () => t`Education plan`,
  specialOffer: () => t`Special Offer`,
  announcement: () => t`ANNOUNCEMENT`,
  upgradeToRedeem: () => t`Upgrade to redeem`,
  goBack: () => t`Go back`,
  clickToDirectlyClaimPromo: () =>
    t`Click here to directly claim the promotion.`,
  views: () => t`Views`,
  clickToUpdate: () => t`Click to update`,
  addToHome: () => t`Add to home`,
  clickToSave: () => t`Click to save`,
  lineHeight: () => t`Line height`,
  lineHeightDesc: () => t`Adjust the line height of the editor`,
  enterTitle: () => t`Enter title`,
  dayFormat: () => t`Day format`,
  dayFormatDesc: () => t`Choose how day is displayed in the app`,
  weekFormat: () => t`Week format`,
  weekFormatDesc: () =>
    t`Choose what day to display as the first day of the week`,
  editCreationDate: () => t`Edit creation date`,
  unlockIncomingNote: () => t`Unlock incoming note`,
  unlockIncomingNoteDesc: () =>
    t`The incoming note could not be unlocked with the provided password. Enter the correct password for the incoming note`,
  setExpiry: () => t`Set expiry`,
  unsetExpiry: () => t`Unset expiry`,
  expiryDate: () => t`Expiry date`,
  exportCsv: () => t`Export CSV`,
  importCsv: () => t`Import CSV`,
  noContent: () => t`This note is empty`,
  deleteData: () => t`Delete data`,
  failedToAttachFile: () => t`Failed to attach file`,
  creating: () => t`Creating...`,
  retry: () => t`Retry`,
  ok: () => t`OK`,
  expired: () => t`Expired`,
  invalidPgpKeyPair: () =>
    t`Invalid PGP key pair. Please check your keys and try again.`,
  lockVaultAfter: () => t`Lock vault after`,
  lockVaultAfterDesc: () =>
    `How long should the vault stay unlocked before automatically locking?`,
  back: () => t`Back`,
  featureNotAvailable: () => t`This feature is not available on this plan.`,
  valueMustBeBetween: (min: number, max: number) =>
    t`Value must be between ${min} and ${max}`,
  pgpPrivateKeyProtected: () =>
    t`Private key is passphrase-protected. Please provide the decrypted key or a key without a passphrase.`,
  passwordRequired: () => t`Password required`,
  confirmPasswordRequired: () => t`Confirm password required`,
  deleteAttachment: () => t`Delete attachment`,
  deleteAttachmentConfirm: () =>
    t`Are you sure you want to delete this attachment?`,
  attachmentDeleted: () => t`Attachment deleted`,
  titleIsRequired: () => t`Title is required`,
  nameIsRequired: () => t`Name is required.`,
  publicKeyRequired: () => t`Public key required`,
  privateKeyRequired: () => t`Private key required`,
  autoGenerateKeys: () => t`Auto-generate keys`,
  details: () => t`Details`,
  show: () => t`Show`,
  itemDeleted: () => t`Item deleted`,
  deleteAll: () => t`Delete all`,
  attachingFiles: () => t`Attaching files`,
  closeCountdown: (seconds: number) => t`Close (${seconds})`,
  compressing: () => t`Compressing`,
  encrypting: () => t`Encrypting`,
  compressionFailed: () => t`Compression failed`,
  openingLocalFile: () => t`Opening local file`,
  openingLocalFileDesc: (filePath: string) =>
    t`Are you sure you want to open this file: ${filePath}?`,
  expiryDateMustBeInTheFuture: () => t`Expiry date must be in the future`,
  expiryDateCannotBeMoreThan1YearInTheFuture: () =>
    t`Expiry date cannot be more than 1 year in the future`,
  expiryDateSet: () => t`Expiry date set`,
  creationDateCannotBeAfterLastEditedDate: () =>
    t`Creation date cannot be after last edited date`,
  noteDuplicated: () => t`Note duplicated`,
  maximumReminderDate: (maxDate: string) =>
    t`Maximum reminder date is ${maxDate}`,
  invalidThemeFileFormat: () =>
    t`We couldn't load this theme. Please make sure the file is a valid JSON theme file.`,
  themeMissingRequiredFields: () =>
    t`We couldn't load this theme. The file appears to be incomplete or missing required theme properties.`,
  copyLogs: () => t`Copy logs`,
  enterPgpPublicKey: () => t`Enter your PGP public key`,
  enterPgpPrivateKey: () => t`Enter your PGP private key`,
  expiryDateRemoved: () => t`Expiry date removed`,
  colorNotePasswordFor: (filename: string) =>
    t`Colornote password for ${filename}`,
  deleteItem: () => t`Delete item`,
  keepScreenOn: () => t`Keep screen on`,
  keepScreenOnDesc: () =>
    t`Prevent the screen from turning off while the editor is focused.`,
  clearHistory: () => t`Clear history`,
  historyCleared: () => t`Version history cleared`,
  clearHistoryConfirmation: () => t`Delete all version history for this note?`,
  deleteVersion: () => doActions.delete.version(1),
  deleteVersionConfirmation: () =>
    actionConfirmations.permanentlyDelete.version(1),
  versionDeleted: () => actions.deleted.version(1),
  offlineMode: () => t`Offline mode`,
  alignment: () => t`Alignment`,
  screenshotMode: () => t`Screenshot mode`,
  exitScreenshotMode: () => t`Exit screenshot mode`,
  screenshotModeHint: () =>
    t`Screenshot mode on. The header, footer and system bars are hidden. Press back to exit.`
};
