import React, { Fragment, useState } from 'react'
import { Spacer } from '../../common/components/spacer/spacer.component'
import { PaperTextInput } from '../../common/components/overrides'
import { FormErrors } from '../../common/components/form.component'
import { SuccessButton } from '../../common/components/button.component'
import { Divider, List } from 'react-native-paper'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { theme as globalTheme } from '../../layout'

interface EventHelpFormProps {
  requestHelp: (description: string) => void
  errorMessages: string[]
  isError: boolean
}

export const EventHelpForm = ({
  requestHelp,
  errorMessages,
  isError
}: EventHelpFormProps): JSX.Element => {
  const [problemType, setProblemType] = useState(ProblemType.Medical)
  const [description, setDescription] = useState<string>(ProblemType.Medical)

  const newOnPress = (problemType: ProblemType) => () => {
    const description = problemType === ProblemType.Custom ? '' : problemType

    setDescription(description)
    setProblemType(problemType)
  }

  return <Fragment>
    <Divider/>
    <StyledText variant='subtitle'>Request help</StyledText>
    <ProblemTypeButton
      icon='medical-services'
      title={ProblemType.Medical}
      onPress={newOnPress(ProblemType.Medical)}
      selected={problemType === ProblemType.Medical}
    />
    <ProblemTypeButton
      icon='security'
      title={ProblemType.Security}
      onPress={newOnPress(ProblemType.Security)}
      selected={problemType === ProblemType.Security}
    />
    <ProblemTypeButton
      icon='edit'
      title={ProblemType.Custom}
      onPress={newOnPress(ProblemType.Custom)}
      selected={problemType === ProblemType.Custom}
    />
    {problemType === ProblemType.Custom &&
      <Spacer size='large' position='top'>
        <Spacer size='large' position='horizontal'>
          <PaperTextInput label='problem description' mode='outlined' error={isError} multiline
            onChangeText={setDescription}/>
        </Spacer>
      </Spacer>
    }
    <FormErrors errorMessages={errorMessages}/>
    <Spacer size='medium' position='all'>
      <SuccessButton icon='send' onPress={() => requestHelp(description)}>
        Send request for help
      </SuccessButton>
    </Spacer>
  </Fragment>
}

interface ProblemTypeButtonProps {
  title: string
  icon: string
  onPress: () => void
  selected: boolean
}

const ProblemTypeButton = ({
  title,
  icon,
  onPress,
  selected
}: ProblemTypeButtonProps): JSX.Element => {
  const titleVariant = selected ? 'selected' : 'body'
  const color = selected ? globalTheme.colors.brand.primary : globalTheme.colors.text.primary
  const listItemStyle = selected ? { backgroundColor: globalTheme.colors.brand.muted } : {}

  return <List.Item
    title={<StyledText variant={titleVariant}>{title}</StyledText>}
    left={props => <List.Icon {...props} color={color} icon={icon}/>}
    onPress={onPress}
    style={listItemStyle}
  />
}

enum ProblemType {
  Medical = 'I need medical assistance',
  Security = 'I need security assistance',
  Custom = 'I will describe my problem'
}
