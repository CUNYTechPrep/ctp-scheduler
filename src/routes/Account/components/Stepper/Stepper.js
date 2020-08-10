import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Email from './components/EmailStep'
import Language from './components/Language'
import Background from './components/Background'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  button: {
    marginRight: theme.spacing(1)
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  completed: {
    display: 'inline-block'
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}))

function getSteps() {
  return [
    'Tell us about your background',
    'Interview Prefferences',
    'Verify Email'
  ]
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Background />
    case 1:
      return <Language />
    case 2:
      return <Email />
    default:
      return 'Unknown step'
  }
}

export default function HorizontalNonLinearAlternativeLabelStepper() {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState(new Set())
  const steps = getSteps()

  const totalSteps = () => {
    return getSteps().length
  }

  const isStepOptional = (step) => {
    return step === 1
  }

  const completedSteps = () => {
    return completed.size
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed
          // find the first step that has been completed
          steps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1

    setActiveStep(newActiveStep)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStep = (step) => () => {
    setActiveStep(step)
  }

  const handleReset = () => {
    setActiveStep(0)
    setCompleted(new Set())
  }

  function isStepComplete(step) {
    return completed.has(step)
  }

  return (
    <div className={classes.root}>
      <Stepper alternativeLabel nonLinear activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {}
          const buttonProps = {}
          if (isStepOptional(index)) {
            buttonProps.optional = (
              <Typography variant="caption">Optional</Typography>
            )
          }
          return (
            <Step key={label} {...stepProps}>
              <StepButton
                onClick={handleStep(index)}
                completed={isStepComplete(index)}
                {...buttonProps}>
                {label}
              </StepButton>
            </Step>
          )
        })}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Grid
                container
                justify="space-around"
                alignContent="space-around">
                <Grid item>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}>
                    Back
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    size="large"
                    onClick={handleNext}
                    className={classes.button}>
                    Next
                  </Button>
                  {activeStep !== steps.length &&
                    (completed.has(activeStep) ? (
                      <Typography
                        variant="caption"
                        className={classes.completed}>
                        Step {activeStep + 1} already completed
                      </Typography>
                    ) : null)}
                </Grid>
              </Grid>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
