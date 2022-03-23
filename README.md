# Synthetic SFTP test

This script test an SFTP site by simply logging into it. Events are posted to table named by the eventType variable. The script assumes port 22 and is set by the cPort constant.

## Secure Credentials

The following secure credentials are used byt his script:
- SFTPHOST          required    Defines the sftp host
- SFTPUSER          required    The sftp user name
- SFTPPASSWORD      optional    Sets the user's password, may be omitted if private key is set
- SFTPPKEY          optional    Sets the user's private key, may be omitted id password is set 
- LOGGINGACCOUNT    required    The New Relic account to log events to
- INGESTAPIKEY      required    The New Relic API Ingest key for thelogging account

NOTE: Either password or private key must be set

## NRQL

Synthetic run status:
FROM SyntheticCheck SELECT count(*) FACET result since 1 day ago

SFTP Check pass/fail: (assumes eventType = 'synCheck')
FROM synCheck SELECT count(*) FACET sftp.connect SINCE 1 DAY AG


